import { Coffee } from "lucide-react";

export function CoffeeLoader({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <Coffee className="size-8 animate-spin-slow text-[#6f3e1d]" />
    </div>
  );
}
