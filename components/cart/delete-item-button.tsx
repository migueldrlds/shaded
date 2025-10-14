'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { removeItem } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';

export function DeleteItemButton({
  item,
  optimisticUpdate
}: {
  item: CartItem;
  optimisticUpdate: any;
}) {
  const merchandiseId = item.merchandise.id;

  const handleRemove = async () => {
    console.log('🗑️ Removing item:', merchandiseId);
    // Actualizar el carrito local primero
    optimisticUpdate(merchandiseId, 'delete');
    
    // Sincronizar con Shopify
    try {
      await removeItem(null, merchandiseId);
      console.log('🗑️ Item removed from Shopify');
    } catch (error) {
      console.error('🗑️ Error removing from Shopify:', error);
    }
  };

  return (
    <button
      onClick={handleRemove}
      aria-label="Remove cart item"
      className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500 hover:bg-neutral-600 transition-colors cursor-pointer"
    >
      <XMarkIcon className="mx-[1px] h-4 w-4 text-white" />
    </button>
  );
}
