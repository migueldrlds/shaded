import { getCollectionProducts, getProducts } from 'lib/shopify';
import DesktopProductCardAlt from '../../components/DesktopProductCardAlt';
import MobileProductCardAlt from '../../components/MobileProductCardAlt';

interface ProductosAltPageProps {
  searchParams: Promise<{ coleccion?: string }>;
}

export default async function ProductosAlt({ searchParams }: ProductosAltPageProps) {
  const params = await searchParams;
  const coleccion = params.coleccion || 'serene';

  // Obtener productos de Shopify
  let allProducts;
  if (coleccion && coleccion !== 'all') {
    allProducts = await getCollectionProducts({
      collection: coleccion,
      reverse: false
    });
  } else {
    allProducts = await getProducts({});
  }
  
  // Si no hay productos, mostrar mensaje
  if (!allProducts || allProducts.length === 0) {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#000000', fontFamily: 'Agressive' }}>
            {coleccion !== 'all' ? `No hay productos en ${coleccion.toUpperCase()}` : 'No hay productos disponibles'}
          </h1>
          <p className="text-lg font-light" style={{ color: '#000000', opacity: 0.6 }}>
            Próximamente tendremos productos disponibles
          </p>
        </div>
      </div>
    );
  }

  const productosFiltrados = allProducts;

  return (
    <div className="min-h-screen relative bg-white">
      {/* Contenido principal */}
      <div className="relative z-10 pt-8 px-6 pb-16">
        <div className="max-w-[1400px] mx-auto">
          {/* Versión móvil - Grid de productos */}
          <div className="md:hidden grid grid-cols-1 gap-8">
            {productosFiltrados.map((producto, index) => (
              <MobileProductCardAlt key={producto.id || index} product={producto} />
            ))}
          </div>

          {/* Versión desktop - Grid de productos 4 columnas */}
          <div className="hidden md:grid md:grid-cols-4 gap-8">
            {productosFiltrados.map((producto, index) => (
              <DesktopProductCardAlt key={producto.id || index} product={producto} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
