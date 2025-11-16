'use client';

import clsx from 'clsx';
import LinkWithTransition from 'components/link-with-transition';
import { Menu } from 'lib/shopify/types';
import { usePathname } from 'next/navigation';

export function FooterMenuItem({ item }: { item: Menu }) {
  const pathname = usePathname();
  
  // Normalizar rutas para comparación (eliminar trailing slashes, query strings y normalizar)
  const normalizePath = (path: string | null | undefined) => {
    if (!path) return '';
    // Eliminar query strings y hash
    const withoutQuery = path.split('?')[0]?.split('#')[0] || '';
    // Eliminar trailing slash excepto para la raíz
    const normalized = withoutQuery === '/' ? '/' : withoutQuery.replace(/\/$/, '');
    return normalized.toLowerCase();
  };
  
  const normalizedPathname = normalizePath(pathname || '');
  const normalizedItemPath = normalizePath(item.path || '');
  
  // También extraer solo la parte final de la ruta para comparar (por si hay prefijos)
  const getPathSegment = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    return segments.length > 0 ? segments[segments.length - 1] : '';
  };
  
  const pathnameSegment = getPathSegment(normalizedPathname);
  const itemPathSegment = getPathSegment(normalizedItemPath);
  
  // Comparar rutas normalizadas - coincidencia exacta o por segmento final
  const isActive = normalizedPathname === normalizedItemPath || 
                   (pathnameSegment && itemPathSegment && pathnameSegment === itemPathSegment) ||
                   (normalizedItemPath && normalizedPathname.includes(normalizedItemPath)) ||
                   (normalizedPathname && normalizedItemPath.includes(normalizedPathname));

  // Si estamos en la página actual, mostrar como span no clickeable
  if (isActive) {
    return (
      <li>
        <span
          className={clsx(
            'block p-2 text-lg underline-offset-4 md:inline-block md:text-sm cursor-default',
            {
              'text-black dark:text-neutral-300': isActive
            }
          )}
        >
          {item.title}
        </span>
      </li>
    );
  }

  return (
    <li>
      <LinkWithTransition
        href={item.path}
        className={clsx(
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300',
          {
            'text-black dark:text-neutral-300': isActive
          }
        )}
      >
        {item.title}
      </LinkWithTransition>
    </li>
  );
}

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <nav>
      <ul>
        {menu.map((item: Menu) => {
          return <FooterMenuItem key={item.title} item={item} />;
        })}
      </ul>
    </nav>
  );
}
