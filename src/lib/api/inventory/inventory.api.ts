import {
  AdjustIngredientStockRequest,
  CreateIngredientRequest,
  RestockIngredientRequest,
  UpdateIngredientRequest,
} from "@/server/shared/inventory/inventory.dto";
import type {
  Ingredient,
  InventoryStats,
  InventoryTransaction,
} from "@/server/shared/inventory/inventory.interface";

// Server types carry `Date`, but everything here travels over JSON, so
// timestamps arrive as ISO strings on the client.
export type IngredientDto = Omit<Ingredient, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type InventoryTransactionDto = Omit<
  InventoryTransaction,
  "createdAt"
> & {
  createdAt: string;
};

export interface ListIngredientsParams {
  search?: string;
  lowStockOnly?: boolean;
  includeInactive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

const BASE_URL = "/api/admin/inventory";

async function parseResponse<T>(response: Response): Promise<T> {
  const result = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | null;

  if (!response.ok) {
    throw new Error(result?.message ?? "Something went wrong.");
  }

  return result as T;
}

interface ListIngredientsResponse {
  data: IngredientDto[];
  stats: InventoryStats;
}

export async function listIngredients(
  params: ListIngredientsParams = {},
): Promise<{ data: Ingredient[]; stats: InventoryStats }> {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.lowStockOnly) query.set("lowStockOnly", "true");
  if (params.includeInactive) query.set("includeInactive", "true");
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  query.set("limit", String(params.limit ?? 10));
  query.set("offset", String(params.offset ?? 0));

  const response = await fetch(`${BASE_URL}?${query.toString()}`);
  const { data, stats } = await parseResponse<ListIngredientsResponse>(response);

  return {
    data: data.map(mapIngredient),
    stats,
  };
}

export async function createIngredient(
  input: CreateIngredientRequest,
): Promise<Ingredient> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const { data } = await parseResponse<{ data: Ingredient }>(response);
  return data;
}

export async function updateIngredient(
  id: string,
  input: UpdateIngredientRequest,
): Promise<Ingredient> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const { data } = await parseResponse<{ data: Ingredient }>(response);
  return data;
}

export async function deactivateIngredient(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  await parseResponse<{ message: string }>(response);
}

export async function reactivateIngredient(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}/reactivate`, {
    method: "POST",
  });
  await parseResponse<{ message: string }>(response);
}

export async function restockIngredient(
  id: string,
  input: RestockIngredientRequest,
): Promise<InventoryTransaction> {
  const response = await fetch(`${BASE_URL}/${id}/restock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const { data } = await parseResponse<{ data: InventoryTransaction }>(
    response,
  );
  return data;
}

export async function adjustIngredientStock(
  id: string,
  input: AdjustIngredientStockRequest,
): Promise<InventoryTransaction> {
  const response = await fetch(`${BASE_URL}/${id}/adjust`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const { data } = await parseResponse<{ data: InventoryTransaction }>(
    response,
  );
  return data;
}

export async function listIngredientTransactions(
  id: string,
  params: { limit?: number; offset?: number } = {},
): Promise<InventoryTransaction[]> {
  const query = new URLSearchParams();
  query.set("limit", String(params.limit ?? 10));
  query.set("offset", String(params.offset ?? 0));

  const response = await fetch(
    `${BASE_URL}/${id}/transactions?${query.toString()}`,
  );
  const { data } = await parseResponse<{ data: InventoryTransaction[] }>(
    response,
  );
  return data;
}

// helper functions

function mapIngredient(dto: IngredientDto): Ingredient {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}
