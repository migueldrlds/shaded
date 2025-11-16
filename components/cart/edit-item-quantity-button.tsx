'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { updateItemQuantity } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate
}: {
  item: CartItem;
  type: 'plus' | 'minus';
  optimisticUpdate: any;
}) {
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
  };

  const handleUpdate = async () => {
    // Actualizar el carrito local primero
    optimisticUpdate(payload.merchandiseId, type);
    
    // Sincronizar con Shopify
    try {
      await updateItemQuantity(null, payload);
    } catch (error) {
      // Error updating quantity in Shopify
    }
  };

  return (
    <button
      onClick={handleUpdate}
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80 cursor-pointer',
        {
          'ml-auto': type === 'minus'
        }
      )}
    >
      {type === 'plus' ? (
        <PlusIcon className="h-4 w-4 text-white" />
      ) : (
        <MinusIcon className="h-4 w-4 text-white" />
      )}
    </button>
  );
}
