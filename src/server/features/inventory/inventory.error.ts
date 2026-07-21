import { ApplicationError } from "@/server/shared/application.error";
import { HttpStatus } from "@/server/shared/http-status-code";

export class IngredientNotFoundError extends ApplicationError {
  constructor(message = "Ingredient not found.") {
    super(message, "INGREDIENT_NOT_FOUND", HttpStatus.NOT_FOUND);
  }
}

export class IngredientSkuAlreadyExistsError extends ApplicationError {
  constructor(message = "An ingredient with this SKU already exists.") {
    super(message, "INGREDIENT_SKU_ALREADY_EXISTS", HttpStatus.CONFLICT);
  }
}

export class InsufficientStockError extends ApplicationError {
  constructor(message = "This change would reduce stock below zero.") {
    super(message, "INSUFFICIENT_STOCK", HttpStatus.CONFLICT);
  }
}
