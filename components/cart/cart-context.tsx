'use client';

import type {
  Cart,
  CartItem,
  Product,
  ProductVariant
} from 'lib/shopify/types';
import React, {
  createContext,
  use,
  useContext,
  useMemo,
  useState
} from 'react';

type UpdateType = 'plus' | 'minus' | 'delete';

type CartAction =
  | {
      type: 'UPDATE_ITEM';
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: 'ADD_ITEM';
      payload: { variant: ProductVariant; product: Product };
    };

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => Promise<void>;
  contextId: string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType
): CartItem | null {
  if (updateType === 'delete') return null;

  const newQuantity =
    updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString()
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount
      }
    }
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode
      }
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage
      }
    }
  };
}

function updateCartTotals(
  lines: CartItem[]
): Pick<Cart, 'totalQuantity' | 'cost'> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'USD';

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: '0', currencyCode }
    }
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: '',
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'USD' },
      totalAmount: { amount: '0', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0', currencyCode: 'USD' }
    }
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItem(item, updateType)
            : item
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: '0' }
          }
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines
      };
    }
    case 'ADD_ITEM': {
      console.log('🛒 ADD_ITEM reducer called');
      const { variant, product } = action.payload;
      console.log('🛒 Adding item:', { variant: variant.title, product: product.title });
      
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id
      );
      console.log('🛒 Existing item found:', existingItem ? 'Yes' : 'No');
      
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product
      );
      console.log('🛒 Updated item:', updatedItem);

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item
          )
        : [...currentCart.lines, updatedItem];

      console.log('🛒 Final lines:', updatedLines.length);

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines
      };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [localCart, setLocalCart] = useState(initialCart);
  
  // Generar un ID único para esta instancia del contexto
  const contextId = useMemo(() => Math.random().toString(36).substr(2, 9), []);
  console.log('🛒 CartProvider - Context ID:', contextId);
  console.log('🛒 CartContext - initialCart:', initialCart);
  console.log('🛒 CartContext - localCart:', localCart);

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    setLocalCart(prevCart => {
      if (!prevCart) return prevCart;
      return cartReducer(prevCart, {
        type: 'UPDATE_ITEM',
        payload: { merchandiseId, updateType }
      });
    });
  };

  const addCartItem = async (variant: ProductVariant, product: Product) => {
    console.log('🛒 addCartItem called:', { variant: variant.title, product: product.title });
    
    // Actualizar el carrito local
    setLocalCart(prevCart => {
      if (!prevCart) return prevCart;
      return cartReducer(prevCart, {
        type: 'ADD_ITEM',
        payload: { variant, product }
      });
    });
    
    // Sincronizar con Shopify usando la acción del servidor
    try {
      const { addItemToCart } = await import('./actions');
      const result = await addItemToCart(variant.id);
      if (result.success) {
        console.log('🛒 Producto sincronizado con Shopify');
      } else {
        console.error('🛒 Error sincronizando con Shopify:', result.error);
      }
    } catch (error) {
      console.error('🛒 Error sincronizando con Shopify:', error);
    }
    
    console.log('🛒 addCartItem completed');
  };

  const contextValue = useMemo(
    () => {
      console.log('🛒 useMemo - localCart:', localCart);
      console.log('🛒 useMemo - localCart.lines:', localCart?.lines?.length);
      return {
        cart: localCart,
        updateCartItem,
        addCartItem,
        contextId
      };
    },
    [localCart, contextId]
  );
  
  console.log('🛒 useMemo - contextValue:', contextValue);
  console.log('🛒 useMemo - contextValue.cart:', contextValue.cart);
  console.log('🛒 useMemo - contextValue.cart.lines:', contextValue.cart?.lines?.length);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
