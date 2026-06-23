"use client";

import { Button } from "@fosl/ui";
import { useCart } from "@/lib/cart-context";

type AddToCartButtonProps = {
  productId: string;
  quantity?: number;
  children?: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  openDrawer?: boolean;
};

export function AddToCartButton({
  productId,
  quantity = 1,
  children = "Add to cart",
  size = "lg",
  className,
  disabled,
  openDrawer = true,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();

  function handleClick() {
    addItem(productId, quantity);
    if (!openDrawer) return;
    openCart();
  }

  return (
    <Button
      type="button"
      size={size}
      className={className}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
