"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
};

export function AddToCart({ product }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add({ ...product, quantity: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button className="button add-button" onClick={handleAdd}>
      {added ? "ADDED TO CART ✓" : "ADD TO BAG"}
    </button>
  );
}
