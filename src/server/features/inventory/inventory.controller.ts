import { factory } from "@/server/hono/hono-factory";
import { container } from "@/server/container";
import { logger } from "@/server/logger";
import { validator } from "@/server/shared/validator";
import {
  adjustIngredientStockRequest,
  createIngredientRequest,
  idParamRequest,
  listIngredientsQueryRequest,
  listTransactionsQueryRequest,
  restockIngredientRequest,
  updateIngredientRequest,
} from "../../shared/inventory/inventory.dto";

export const listIngredientsController = factory.createHandlers(
  validator("query", listIngredientsQueryRequest),
  async (c) => {
    const query = c.req.valid("query");
    logger.info({ query }, "Fetching ingredients list");
    const { data, stats } = await container.inventoryService.listIngredients(query);
    logger.info({ count: data.length, stats }, "Ingredients list fetched");

    return c.json({ data, stats });
  },
);

export const getIngredientController = factory.createHandlers(
  validator("param", idParamRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    logger.info({ id }, "Fetching ingredient by id");
    const data = await container.inventoryService.getIngredient(id);

    if (!data) {
      logger.warn({ id }, "Ingredient not found");
      return c.json({ message: "Ingredient not found." }, 404);
    }

    logger.info({ id }, "Ingredient fetched");
    return c.json({ data });
  },
);

export const createIngredientController = factory.createHandlers(
  validator("json", createIngredientRequest),
  async (c) => {
    const input = c.req.valid("json");
    logger.info({ input }, "Creating ingredient");
    const data = await container.inventoryService.createIngredient(input);

    logger.info({ id: data.id }, "Ingredient created");
    return c.json({ message: "Ingredient created successfully.", data }, 201);
  },
);

export const updateIngredientController = factory.createHandlers(
  validator("param", idParamRequest),
  validator("json", updateIngredientRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    logger.info({ id, input }, "Updating ingredient");
    const data = await container.inventoryService.updateIngredient(id, input);

    if (!data) {
      logger.warn({ id }, "Ingredient not found on update");
      return c.json({ message: "Ingredient not found." }, 404);
    }

    logger.info({ id }, "Ingredient updated");
    return c.json({ message: "Ingredient updated successfully.", data });
  },
);

export const deactivateIngredientController = factory.createHandlers(
  validator("param", idParamRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    logger.info({ id }, "Deactivating ingredient");
    await container.inventoryService.deactivateIngredient(id);

    logger.info({ id }, "Ingredient deactivated");
    return c.json({ message: "Ingredient deactivated successfully." });
  },
);

export const restockIngredientController = factory.createHandlers(
  validator("param", idParamRequest),
  validator("json", restockIngredientRequest),
  async (c) => {
    const user = c.get("user");

    if (!user) {
      logger.warn("Unauthorized restock attempt");
      return c.json({ message: "Unauthorized" }, 401);
    }

    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    logger.info({ id, input, userId: user.id }, "Restocking ingredient");
    const data = await container.inventoryService.restock(id, input, user.id);

    logger.info({ id }, "Ingredient restocked");
    return c.json({ message: "Ingredient restocked successfully.", data }, 201);
  },
);

export const adjustIngredientStockController = factory.createHandlers(
  validator("param", idParamRequest),
  validator("json", adjustIngredientStockRequest),
  async (c) => {
    const user = c.get("user");

    if (!user) {
      logger.warn("Unauthorized stock adjustment attempt");
      return c.json({ message: "Unauthorized" }, 401);
    }

    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    logger.info({ id, input, userId: user.id }, "Adjusting ingredient stock");
    const data = await container.inventoryService.adjustStock(
      id,
      input,
      user.id,
    );

    logger.info({ id }, "Stock adjusted");
    return c.json({ message: "Stock adjusted successfully.", data }, 201);
  },
);

export const listIngredientTransactionsController = factory.createHandlers(
  validator("param", idParamRequest),
  validator("query", listTransactionsQueryRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    const query = c.req.valid("query");
    logger.info({ id, query }, "Fetching ingredient transactions");
    const data = await container.inventoryService.listTransactions(id, query);

    logger.info({ id, count: data.length }, "Ingredient transactions fetched");
    return c.json({ data });
  },
);
