import { Hono } from "hono";
import { Env } from "@/server/hono/hono-types";
import {
  adjustIngredientStockController,
  createIngredientController,
  deactivateIngredientController,
  getIngredientController,
  listIngredientTransactionsController,
  listIngredientsController,
  restockIngredientController,
  updateIngredientController,
} from "./inventory.controller";

const inventoryAdminRoutes = new Hono<Env>()

  .get("/", ...listIngredientsController)
  .get("/:id", ...getIngredientController)
  .post("/", ...createIngredientController)
  .patch("/:id", ...updateIngredientController)
  .delete("/:id", ...deactivateIngredientController)
  .post("/:id/restock", ...restockIngredientController)
  .post("/:id/adjust", ...adjustIngredientStockController)
  .get("/:id/transactions", ...listIngredientTransactionsController);

export default inventoryAdminRoutes;
