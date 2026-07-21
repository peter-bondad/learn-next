import { z } from "zod";
import { inventoryUnit, manualAdjustmentType } from "./inventory.constant";

export const idParamDto = z
  .object({
    id: z.string().trim().min(1),
  })
  .strict();

export type IdParamDto = z.infer<typeof idParamDto>;

// Note: intentionally no `currentStock` field here. New ingredients always
// start at 0 and are stocked via /restock, so every unit ever added is
// backed by an inventoryTransactions row — never set silently on create.
export const createIngredientDto = z
  .object({
    name: z.string().trim().min(1).max(150),
    sku: z.string().trim().min(1).max(60).optional(),
    unit: z.enum(inventoryUnit),
    reorderThreshold: z.number().int().min(0).default(0),
    reorderQuantity: z.number().int().min(0).default(0),
    unitCost: z.number().int().min(0).default(0), // cents per unit
    supplierId: z.string().trim().min(1).optional(),
  })
  .strict();

export type CreateIngredientDto = z.infer<typeof createIngredientDto>;

export const updateIngredientDto = z
  .object({
    name: z.string().trim().min(1).max(150).optional(),
    sku: z.string().trim().min(1).max(60).optional(),
    unit: z.enum(inventoryUnit).optional(),
    reorderThreshold: z.number().int().min(0).optional(),
    reorderQuantity: z.number().int().min(0).optional(),
    unitCost: z.number().int().min(0).optional(),
    supplierId: z.string().trim().min(1).nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export type UpdateIngredientDto = z.infer<typeof updateIngredientDto>;

export const restockIngredientDto = z
  .object({
    quantity: z.number().int().positive(),
    unitCost: z.number().int().min(0).optional(), // update cost basis if the new batch price changed
    note: z.string().trim().max(500).optional(),
  })
  .strict();

export type RestockIngredientDto = z.infer<typeof restockIngredientDto>;

export const adjustIngredientStockDto = z
  .object({
    type: z.enum(manualAdjustmentType),
    quantityChange: z.number().int().positive(),
    note: z.string().trim().max(500).optional(),
  })
  .strict();

export type AdjustIngredientStockDto = z.infer<typeof adjustIngredientStockDto>;

export const listIngredientsQueryDto = z
  .object({
    search: z.string().trim().max(150).optional(),
    lowStockOnly: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => val === "true"),
    includeInactive: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => val === "true"),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export type ListIngredientsQueryDto = z.infer<typeof listIngredientsQueryDto>;

export const listTransactionsQueryDto = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export type ListTransactionsQueryDto = z.infer<typeof listTransactionsQueryDto>;
