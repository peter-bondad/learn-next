import { ListIngredientsParams } from "./inventory.api";

export const inventoryKeys = {
  all: ["inventory"] as const,

  ingredients: (params?: ListIngredientsParams) =>
    [...inventoryKeys.all, "ingredients", params] as const,

  ingredient: (id: string) => [...inventoryKeys.all, "ingredient", id] as const,

  transactions: (ingredientId: string, limit = 50, offset = 0) =>
    [
      ...inventoryKeys.all,
      "transactions",
      ingredientId,
      limit,
      offset,
    ] as const,
};
