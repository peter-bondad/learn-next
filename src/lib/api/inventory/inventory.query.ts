import { useQuery } from "@tanstack/react-query";

import {
  listIngredients,
  listIngredientTransactions,
  type ListIngredientsParams,
} from "./inventory.api";
import { inventoryKeys } from "./inventory.keys";

export function useIngredients(
  params: ListIngredientsParams,
) {
  return useQuery({
    queryKey: inventoryKeys.ingredients(params),
    queryFn: () => listIngredients(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useIngredientTransactions(
  ingredientId: string,
  limit = 50,
  offset = 0,
) {
  return useQuery({
    queryKey: inventoryKeys.transactions(ingredientId, limit, offset),
    queryFn: () =>
      listIngredientTransactions(ingredientId, {
        limit,
        offset,
      }),
    enabled: !!ingredientId,
  });
}
