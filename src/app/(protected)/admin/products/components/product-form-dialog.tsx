"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useProduct } from "@/lib/api/product/product.query";
import { useUpdateProduct } from "@/lib/api/product/product.mutation";
import type { ProductDetail } from "@/server/shared/product/product.interface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
};

function EditProductForm({
  product,
  onOpenChange,
}: {
  product: ProductDetail;
  onOpenChange: (open: boolean) => void;
}) {
  const updateMutation = useUpdateProduct();
  const primary = product.variants[0];

  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description ?? "");
  const [isAvailable, setIsAvailable] = useState(product.isAvailable);
  const [variantName, setVariantName] = useState(primary?.name ?? "");
  const [variantPrice, setVariantPrice] = useState(
    primary ? String(primary.price / 100) : "",
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceCents = Math.round(parseFloat(variantPrice || "0") * 100);

    const updatePayload = {
      name,
      category,
      description: description || null,
      isAvailable,
      variants: [
        {
          id: primary.id,
          sku: primary.sku,
          name: variantName,
          price: priceCents,
          isAvailable: primary.isAvailable,
          displayOrder: primary.displayOrder,
        },
      ],
      images: product.images?.map((img) => ({
        id: img.id,
        url: img.url,
        displayOrder: img.displayOrder,
      })),
    };

    setSubmitting(true);

    try {
      await updateMutation.mutateAsync({ id: product.id, input: updatePayload });
      toast.success("Product updated");
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update product.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="product-name">Name</FieldLabel>
          <Input
            id="product-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>

        <Field orientation="horizontal">
          <FieldLabel htmlFor="product-category">Category</FieldLabel>
          <Input
            id="product-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Field>

        <Field orientation="horizontal">
          <FieldLabel htmlFor="product-description">Description</FieldLabel>
          <Input
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FieldDescription>Optional short description.</FieldDescription>
        </Field>

        <Field orientation="horizontal">
          <FieldLabel htmlFor="variant-name">Variant Name</FieldLabel>
          <Input
            id="variant-name"
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
            required
          />
        </Field>

        <Field orientation="horizontal">
          <FieldLabel htmlFor="variant-price">Price (₱)</FieldLabel>
          <Input
            id="variant-price"
            type="number"
            min="0"
            step="0.01"
            value={variantPrice}
            onChange={(e) => setVariantPrice(e.target.value)}
            required
          />
        </Field>

        <Field orientation="horizontal">
          <FieldLabel>Available</FieldLabel>
          <Switch
            checked={isAvailable}
            onCheckedChange={setIsAvailable}
          />
        </Field>
      </FieldGroup>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ProductFormDialog({
  open,
  onOpenChange,
  productId,
}: ProductFormDialogProps) {
  const { data, isLoading, error } = useProduct(productId ?? undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product details, pricing, and availability.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="text-sm text-destructive">{error.message}</p>
        ) : isLoading || !data ? (
          <div className="space-y-3">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-20 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ) : (
          <EditProductForm
            key={`edit-product-${data.id}`}
            product={data}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
