# View Transitions - Guía de Uso

## Configuración

Las transiciones de vista están configuradas en:
- `app/layout.tsx` - ViewTransitions wrapper
- `app/globals.css` - Estilos CSS para las transiciones
- `lib/view-transitions.ts` - Función de animación `slideInOut()`
- `components/link-with-transition.tsx` - Componente Link personalizado

## Cómo Usar

### Opción 1: Usar el componente Link personalizado

Reemplaza `Link` de `next/link` con `LinkWithTransition`:

```tsx
// Antes
import Link from 'next/link';
<Link href="/productos">Productos</Link>

// Después
import LinkWithTransition from 'components/link-with-transition';
<LinkWithTransition href="/productos">Productos</LinkWithTransition>
```

### Opción 2: Usar el hook directamente

```tsx
'use client';

import { useViewTransition } from '@/hooks/use-view-transition';
import { useCartModal } from '@/components/cart/cart-modal-context';

export default function MiComponente() {
  const { navigateTo, isAnimating } = useViewTransition();
  const { isOpen: isCartOpen } = useCartModal();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const delay = isCartOpen ? 500 : 0;
    navigateTo('/productos', delay);
  };

  return (
    <a href="/productos" onClick={handleClick}>
      Ir a productos
    </a>
  );
}
```

## Notas Importantes

1. **Soporte del navegador**: Las transiciones requieren que el navegador soporte la View Transitions API (Chrome 111+, Edge 111+)

2. **Links externos**: Los links externos (http://, mailto:, etc.) no usan transiciones automáticamente

3. **Estado del carrito**: Si el carrito está abierto, hay un delay de 500ms antes de navegar

## Verificar que funciona

1. Abre las herramientas de desarrollador (F12)
2. Ve a la consola
3. Navega entre páginas usando los links
4. Deberías ver las transiciones animadas

Si no funcionan, verifica:
- Que el navegador soporte View Transitions API
- Que los links estén usando `LinkWithTransition` o el hook `useViewTransition`
- Que no haya errores en la consola

