import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import {
  inventoryTransactionTypeEnum,
  inventoryUnitEnum,
} from "./schema-pg.enum";
import { orders, productVariants, suppliers, users } from ".";

// --- Ingredients (raw materials — beans, milk, syrup, cups, lids) ---

export const ingredients = pgTable("ingredients", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  sku: text("sku").unique(),

  unit: inventoryUnitEnum("unit").notNull(),

  // current stock, stored in smallest tracked unit (e.g. grams, ml, pcs)
  currentStock: integer("current_stock").notNull().default(0),

  reorderThreshold: integer("reorder_threshold").notNull().default(0),
  reorderQuantity: integer("reorder_quantity").notNull().default(0),

  unitCost: integer("unit_cost").notNull().default(0), // cents per unit, for COGS

  supplierId: text("supplier_id").references(() => suppliers.id, {
    onDelete: "set null",
  }),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// --- Recipe: how much of each ingredient a product consumes ---

export const productIngredients = pgTable("product_ingredients", {
  id: text("id").primaryKey(),

  variantId: text("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),

  ingredientId: text("ingredient_id")
    .notNull()
    .references(() => ingredients.id, { onDelete: "restrict" }),

  // amount consumed per one unit of this variant sold, in ingredient's unit
  quantityUsed: integer("quantity_used").notNull(),
});

// --- Inventory ledger: every stock change, auditable ---

export const inventoryTransactions = pgTable("inventory_transactions", {
  id: text("id").primaryKey(),

  ingredientId: text("ingredient_id")
    .notNull()
    .references(() => ingredients.id, { onDelete: "cascade" }),

  type: inventoryTransactionTypeEnum("type").notNull(),

  // signed: positive for restock/return, negative for sale/waste
  quantityChange: integer("quantity_change").notNull(),

  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),

  // optional link back to the order that triggered a sale_deduction
  orderId: text("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),

  note: text("note"),

  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- Relations ---

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  ingredients: many(ingredients),
}));

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [ingredients.supplierId],
    references: [suppliers.id],
  }),
  productIngredients: many(productIngredients),
  transactions: many(inventoryTransactions),
}));

export const productIngredientsRelations = relations(
  productIngredients,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [productIngredients.variantId],
      references: [productVariants.id],
    }),
    ingredient: one(ingredients, {
      fields: [productIngredients.ingredientId],
      references: [ingredients.id],
    }),
  }),
);

export const inventoryTransactionsRelations = relations(
  inventoryTransactions,
  ({ one }) => ({
    ingredient: one(ingredients, {
      fields: [inventoryTransactions.ingredientId],
      references: [ingredients.id],
    }),
    order: one(orders, {
      fields: [inventoryTransactions.orderId],
      references: [orders.id],
    }),
    createdByUser: one(users, {
      fields: [inventoryTransactions.createdBy],
      references: [users.id],
    }),
  }),
);
