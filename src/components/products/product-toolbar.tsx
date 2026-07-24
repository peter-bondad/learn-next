import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

type ProductToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddProduct?: () => void;
};

export function ProductToolbar({
  search,
  onSearchChange,
  onAddProduct,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

          <Input
            value={search}
            placeholder="Search products..."
            className="pl-9"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {onAddProduct && (
        <Button onClick={onAddProduct} className="cursor-pointer">
          <Plus className="mr-2 size-4" />
          Add Product
        </Button>
      )}
    </div>
  );
}
