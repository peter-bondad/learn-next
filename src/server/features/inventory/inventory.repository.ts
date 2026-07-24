import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";

import db from "@/server/infra/database/client";
import {
  ingredients,
  inventoryTransactions,
} from "@/server/infra/database/schemas";
import { logger } from "@/server/logger";

import type {
  ApplyStockChangeInput,
  CreateIngredientData,
  IInventoryRepository,
  Ingredient,
  InventoryStats,
  InventoryTransaction,
  ListIngredientsFilter,
  ListTransactionsFilter,
  UpdateIngredientData,
} from "../../shared/inventory/inventory.interface";

export class InventoryRepository implements IInventoryRepository {
  constructor(private readonly database = db) {}

  async findAllIngredients(
    filter: ListIngredientsFilter,
  ): Promise<{ data: Ingredient[]; stats: InventoryStats }> {
    logger.info({ filter }, "Querying ingredients");
    const conditions: unknown[] = [];

    if (!filter.includeInactive) {
      conditions.push(eq(ingredients.isActive, true));
    }

    if (filter.search) {
      conditions.push(
        or(
          ilike(ingredients.name, `%${filter.search}%`),
          ilike(ingredients.sku, `%${filter.search}%`),
        ),
      );
    }

    if (filter.lowStockOnly) {
      conditions.push(
        sql`${ingredients.currentStock} <= ${ingredients.minimumStockLevel}`,
      );
    }

    const sortColumn =
      filter.sortBy === "sku"
        ? ingredients.sku
        : filter.sortBy === "currentStock"
          ? ingredients.currentStock
          : filter.sortBy === "minimumStockLevel"
            ? ingredients.minimumStockLevel
            : filter.sortBy === "averageUnitCost"
              ? ingredients.averageUnitCost
              : ingredients.name;

    const orderBy =
      filter.sortOrder === "desc" ? [desc(sortColumn)] : [asc(sortColumn)];

    const [data, allData] = (await Promise.all([
      this.database.query.ingredients.findMany({
        // drizzle-orm `and()` requires explicit argument types; dynamic spread
        // from a conditions array needs a cast here.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: conditions.length ? and(...(conditions as any)) : undefined,
        orderBy,
        limit: filter.limit,
        offset: filter.offset,
      }),
      this.database.query.ingredients.findMany({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: conditions.length ? and(...(conditions as any)) : undefined,
      }),
    ])) as [Ingredient[], Ingredient[]];

    logger.info({ count: data.length, stats: computeStats(allData) }, "Ingredients queried");
    return { data, stats: computeStats(allData) };
  }

  async findIngredientById(id: string): Promise<Ingredient | undefined> {
    return this.database.query.ingredients.findFirst({
      where: eq(ingredients.id, id),
    }) as Promise<Ingredient | undefined>;
  }

  async findIngredientBySku(sku: string): Promise<Ingredient | undefined> {
    return this.database.query.ingredients.findFirst({
      where: eq(ingredients.sku, sku),
    }) as Promise<Ingredient | undefined>;
  }

  async createIngredient(data: CreateIngredientData): Promise<Ingredient> {
    const [created] = await this.database
      .insert(ingredients)
      .values({
        id: randomUUID(),
        name: data.name,
        sku: data.sku,
        unit: data.unit,
        minimumStockLevel: data.minimumStockLevel,
        restockQuantity: data.restockQuantity,
        averageUnitCost: data.averageUnitCost,
        supplierId: data.supplierId,
      })
      .returning();

    return created as Ingredient;
  }

  async updateIngredient(
    id: string,
    data: UpdateIngredientData,
  ): Promise<Ingredient | undefined> {
    const [updated] = await this.database
      .update(ingredients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ingredients.id, id))
      .returning();

    return updated as Ingredient | undefined;
  }

  async setIngredientActive(id: string, isActive: boolean): Promise<boolean> {
    const result = await this.database
      .update(ingredients)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(ingredients.id, id))
      .returning({ id: ingredients.id });

    return result.length > 0;
  }

  async applyStockChange(
    input: ApplyStockChangeInput,
  ): Promise<InventoryTransaction | undefined> {
    return this.database.transaction(async (tx) => {
      // Atomic conditional UPDATE — guards against negative stock and races
      // in one statement, no read-then-write.
      const [updated] = await tx
        .update(ingredients)
        .set({
          currentStock: sql`${ingredients.currentStock} + ${input.quantityChange}`,
          ...(input.averageUnitCost !== undefined
            ? { averageUnitCost: input.averageUnitCost }
            : {}),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(ingredients.id, input.ingredientId),
            sql`${ingredients.currentStock} + ${input.quantityChange} >= 0`,
          ),
        )
        .returning({ currentStock: ingredients.currentStock });

      if (!updated) {
        return undefined;
      }

      const newStock = updated.currentStock;
      const previousStock = newStock - input.quantityChange;

      const [transaction] = await tx
        .insert(inventoryTransactions)
        .values({
          id: randomUUID(),
          ingredientId: input.ingredientId,
          type: input.type,
          quantityChange: input.quantityChange,
          previousStock,
          newStock,
          orderId: input.orderId,
          note: input.note,
          createdBy: input.createdBy,
        })
        .returning();

      return transaction as InventoryTransaction;
    });
  }

  async findTransactions(
    filter: ListTransactionsFilter,
  ): Promise<InventoryTransaction[]> {
    return this.database.query.inventoryTransactions.findMany({
      where: eq(inventoryTransactions.ingredientId, filter.ingredientId),
      orderBy: (table, { desc }) => [desc(table.createdAt)],
      limit: filter.limit,
      offset: filter.offset,
    }) as Promise<InventoryTransaction[]>;
  }
}

function computeStats(ingredients: Ingredient[]): InventoryStats {
  const active = ingredients.filter((i) => i.isActive);
  const lowStock = active.filter(
    (i) => i.currentStock > 0 && i.currentStock <= i.minimumStockLevel,
  );
  const outOfStock = active.filter((i) => i.currentStock <= 0);
  const totalValue = active.reduce(
    (sum, i) => sum + i.currentStock * i.averageUnitCost,
    0,
  );

  return {
    total: active.length,
    lowStock: lowStock.length,
    outOfStock: outOfStock.length,
    totalValue,
  };
}
