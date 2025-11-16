import { getCollectionProducts, getProducts } from 'lib/shopify';
import Image from 'next/image';
import DesktopProductCard from '../../components/DesktopProductCard';
import MobileProductCard from '../../components/MobileProductCard';
import ProductosClient from '../../components/productos-client';

interface ProductosPageProps {
  searchParams: Promise<{ coleccion?: string }>;
}

export default async function Productos({ searchParams }: ProductosPageProps) {
  const params = await searchParams;
  const coleccion = params.coleccion || 'serene';

  // Obtener productos de Shopify
  let allProducts;
  if (coleccion && coleccion !== 'all') {
    // Si se especifica una colección, obtener productos de esa colección
    allProducts = await getCollectionProducts({
      collection: coleccion,
      reverse: false
    });
  } else {
    // Si no se especifica colección o es 'all', obtener todos los productos
    allProducts = await getProducts({});
  }
  
  // Si no hay productos, mostrar mensaje
  if (!allProducts || allProducts.length === 0) {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{ backgroundColor: '#d2d5d3' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            {coleccion !== 'all' ? `No hay productos en ${coleccion.toUpperCase()}` : 'No hay productos disponibles'}
          </h1>
          <p className="text-lg font-light" style={{ color: '#FFFFFF', opacity: 0.8 }}>
            Próximamente tendremos productos disponibles
          </p>
        </div>
      </div>
    );
  }

  // Tomar todos los productos disponibles
  const productosFiltrados = allProducts;

  // Función para formatear el precio
  const formatPrice = (price: any) => {
    if (!price) return '$0.00';
    return `$${parseFloat(price.amount).toFixed(2)} ${price.currencyCode}`;
  };

  // Función para obtener detalles del producto desde Shopify
  const getProductDetails = (product: any) => {
    if (!product) return [];
    
    // Usar la descripción del producto de Shopify
    const description = product.description || '';
    
    // Si hay descripción, procesar el formato
    if (description) {
      // Dividir por títulos específicos
      const titleRegex = /(THE EXPERIENCE|THE FEATURES|THE FINISH|WASH AND CARE|MODEL INFO)/g;
      const parts = description.split(titleRegex).filter((part: string) => part.trim() !== '');
      
      const processedLines: string[] = [];
      
      for (let i = 0; i < parts.length; i++) {
        const part: string = parts[i].trim();
        
        // Si es un título, agregarlo sin viñeta
        if (titleRegex.test(part)) {
          processedLines.push(part);
        } else {
          // Es contenido, dividir en viñetas individuales
          // Usar un enfoque más simple basado en el texto real
          const content = part.trim();
          
          // Dividir por patrones específicos que veo en el ejemplo
          const patterns = [
            'Luxurious blend of comfort and quality',
            '90% Cotton 15% Elastane',
            'Everyday use',
            'Contrasting elastic double waistband',
            'Sealed "SHADED" printed logo',
            'Long sleeves',
            'Cropped length',
            'Oversized Fit',
            'Breathable',
            'Stretchy',
            'Cold wash',
            'Dry on low heat',
            'Cool iron if needed',
            'No bleach/dry clean',
            'Curly hair model wears size XS in Black',
            'Straight hair model wears size Medium in Black',
            'Model wearing grey wears size XL'
          ];
          
          // Buscar cada patrón en el contenido
          let remainingContent = content;
          patterns.forEach(pattern => {
            const index = remainingContent.indexOf(pattern);
            if (index !== -1) {
              // Agregar el patrón como viñeta
              processedLines.push(`.${pattern}`);
              // Remover el patrón del contenido restante
              remainingContent = remainingContent.substring(index + pattern.length).trim();
            }
          });
          
          // Si queda contenido, agregarlo también
          if (remainingContent && remainingContent.length > 2) {
            processedLines.push(`.${remainingContent}`);
          }
        }
      }
      
      return processedLines;
    }
    
    // Si no hay descripción, usar el formato original con puntos
    const fallbackDetails = [
      'THE EXPERIENCE',
      '.Luxurious blend of comfort and quality',
      '.90% Cotton 15% Elastane',
      '.Everyday use',
      'THE FEATURES',
      '.Contrasting elastic double waistband',
      '.Sealed "SHADED" printed logo',
      '.Long sleeves',
      'THE FINISH',
      '.Cropped length',
      '.Oversized Fit',
      '.Breathable',
      '.Stretchy',
      'WASH AND CARE',
      '.Cold wash',
      '.Dry on low heat',
      '.Cool iron if needed',
      '.No bleach/dry clean'
    ];
    
    return fallbackDetails;
  };

  return (
    <div className="min-h-screen relative">
      {/* Video de fondo (fijo, debajo de todo) */}
      <video
        className="fixed inset-0 w-full h-full object-cover -z-20"
        src="/videoloop2.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay sutil (fijo, sobre el video) */}
      <div className="fixed inset-0 bg-black/20 -z-10"></div>
      
      {/* Contenido principal */}
      <ProductosClient products={productosFiltrados}>
        <div className="relative z-10 pt-24 px-4 pb-4">
          <div className="max-w-7xl mx-auto">
            {/* Título de la página */}
            {coleccion !== 'all' && (
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#FFFFFF' }}>
                  {coleccion.toUpperCase()} COLLECTION
                </h1>
                <p className="text-lg font-light" style={{ color: '#FFFFFF', opacity: 0.8 }}>
                  Descubre los productos de esta colección
                </p>
              </div>
            )}


            {/* Versión móvil - Cards de productos dinámicos */}
            <div className="max-w-7xl mx-auto flex flex-col items-center md:hidden mt-8 space-y-8">
              {productosFiltrados.map((producto, index) => (
                <MobileProductCard key={producto.id || index} product={producto} />
              ))}
            </div>

            {/* Versión desktop - Cards de productos dinámicos */}
            <div className="max-w-7xl mx-auto flex flex-col items-center hidden md:block mt-8 space-y-12">
              {productosFiltrados.map((producto, index) => (
                <div key={producto.id || index} className="max-w-7xl mx-auto flex justify-center">
                  <div className="bg-white/50 backdrop-blur-xl rounded-3xl pl-5 pr-0 pt-8 pb-0 relative h-[35rem] md:h-[45rem] w-full max-w-7xl">
                    {/* Logo en la esquina izquierda */}
                    <div className="absolute top-4 left-4 z-10 mt-4 ml-4">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </div>

                    {/* Número grande */}
                    <div className="absolute z-10 mt-2" style={{ top: '1rem', left: 'calc(20% + 2rem)' }}>
                      <span className="select-none leading-none" style={{ fontWeight: 700, fontSize: '3.5rem', lineHeight: 1, color: '#000000' }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Bloque de detalles */}
                    <div className="absolute z-10 mt-3" style={{ top: '1rem', left: 'calc(25% + 10rem)' }}>
                      <h2 className="text-[11px] font-light" style={{ color: '#000000' }}>{producto?.title}</h2>
                      <p className="text-[11px] font-light" style={{ color: '#000000', opacity: 1 }}>by shaded</p>
                      <div className="mt-3 text-[11px] leading-tight" style={{ color: '#000000' }}>
                        <div className="grid grid-cols-3 gap-4">
                          {/* Primera columna - primeros 7 elementos */}
                          <div className="space-y-2">
                            {getProductDetails(producto).slice(0, 7).map((item: string, idx: number) => {
                              // Si es un título (mayúsculas), renderizar como título
                              if (item === item.toUpperCase() && item.includes(' ')) {
                                return (
                                  <div key={idx} className="font-normal mt-2 first:mt-0">
                                    {item}
                                  </div>
                                );
                              }
                              // Si empieza con punto, renderizar como lista con viñeta
                              if (item.startsWith('.')) {
                                return (
                                  <div key={idx} className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>{item.substring(1)}</span>
                                  </div>
                                );
                              }
                              // Si no empieza con punto, renderizar normal
                              return (
                                <div key={idx} className="flex items-start">
                                  <span className="mr-2 mt-1">•</span>
                                  <span>{item}</span>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Segunda columna - elementos 8-14 */}
                          <div className="space-y-2">
                            {getProductDetails(producto).slice(7, 14).map((item: string, idx: number) => {
                              // Si es un título (mayúsculas), renderizar como título
                              if (item === item.toUpperCase() && item.includes(' ')) {
                                return (
                                  <div key={idx + 7} className="font-normal mt-2 first:mt-0">
                                    {item}
                                  </div>
                                );
                              }
                              // Si empieza con punto, renderizar como lista con viñeta
                              if (item.startsWith('.')) {
                                return (
                                  <div key={idx + 7} className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>{item.substring(1)}</span>
                                  </div>
                                );
                              }
                              // Si no empieza con punto, renderizar normal
                              return (
                                <div key={idx + 7} className="flex items-start">
                                  <span className="mr-2 mt-1">•</span>
                                  <span>{item}</span>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Tercera columna - elementos 15+ */}
                          <div className="space-y-2">
                            {getProductDetails(producto).slice(14).map((item: string, idx: number) => {
                              // Si es un título (mayúsculas), renderizar como título
                              if (item === item.toUpperCase() && item.includes(' ')) {
                                return (
                                  <div key={idx + 14} className="font-normal mt-2 first:mt-0">
                                    {item}
                                  </div>
                                );
                              }
                              // Si empieza con punto, renderizar como lista con viñeta
                              if (item.startsWith('.')) {
                                return (
                                  <div key={idx + 14} className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>{item.substring(1)}</span>
                                  </div>
                                );
                              }
                              // Si no empieza con punto, renderizar normal
                              return (
                                <div key={idx + 14} className="flex items-start">
                                  <span className="mr-2 mt-1">•</span>
                                  <span>{item}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Componente de card de escritorio */}
                    <DesktopProductCard product={producto} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ProductosClient>
    </div>
  );
}