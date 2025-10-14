import { getCollectionProducts, getProducts } from 'lib/shopify';
import Image from 'next/image';

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
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2E2E2C', fontFamily: 'Agressive' }}>
            {coleccion !== 'all' ? `No hay productos en ${coleccion.toUpperCase()}` : 'No hay productos disponibles'}
          </h1>
          <p className="text-lg font-light" style={{ color: '#2E2E2C', opacity: 0.7 }}>
            Próximamente tendremos productos disponibles
          </p>
        </div>
      </div>
    );
  }

  // Tomar los primeros 2 productos disponibles
  const productosFiltrados = allProducts.slice(0, 2);
  const producto01 = productosFiltrados[0];
  const producto02 = productosFiltrados[1];

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
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      {/* Video de fondo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videoloop2.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Título de la página */}
          {coleccion !== 'all' && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C', fontFamily: 'Agressive' }}>
                {coleccion.toUpperCase()} COLLECTION
              </h1>
              <p className="text-lg font-light" style={{ color: '#2E2E2C', opacity: 0.7 }}>
                Descubre los productos de esta colección
              </p>
            </div>
          )}

          {/* Card contenedor de productos - Carrusel */}
          <div className="max-w-7xl mx-auto flex justify-center">
            <div className="bg-white/50 backdrop-blur-xl rounded-3xl pl-5 pr-0 pt-8 pb-0 relative h-[35rem] md:h-[45rem] w-full max-w-7xl mt-12">
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

              {/* Encabezado alineado al top, a la altura horizontal del card derecho */}
              {/* Número grande (fijo) */}
              <div className="absolute z-10 mt-2" style={{ top: '1rem', left: 'calc(20% + 2rem)' }}>
                <span className="select-none leading-none" style={{ fontFamily: 'Agressive', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1, color: '#000000' }}>01</span>
              </div>

              {/* Bloque de detalles (fijo, independiente del número) */}
              <div className="absolute z-10 mt-3" style={{ top: '1rem', left: 'calc(25% + 10rem)' }}>
                <h2 className="text-[11px] font-light" style={{ color: '#000000', fontFamily: 'Agressive' }}>{producto01?.title}</h2>
                <p className="text-[11px] font-light" style={{ color: '#000000', opacity: 1, fontFamily: 'Agressive' }}>by shaded</p>
                <div className="mt-3 text-[11px] leading-tight" style={{ color: '#000000', fontFamily: 'NCS' }}>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Primera columna - primeros 7 elementos */}
                    <div className="space-y-2">
                      {getProductDetails(producto01).slice(0, 7).map((item: string, idx: number) => {
                        // Si es un título (mayúsculas), renderizar como título
                        if (item === item.toUpperCase() && item.includes(' ')) {
                          return (
                            <div key={idx} className="font-normal mt-2 first:mt-0" style={{ fontFamily: 'NCS' }}>
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
                      {getProductDetails(producto01).slice(7, 14).map((item: string, idx: number) => {
                        // Si es un título (mayúsculas), renderizar como título
                        if (item === item.toUpperCase() && item.includes(' ')) {
                          return (
                            <div key={idx + 7} className="font-normal mt-2 first:mt-0" style={{ fontFamily: 'NCS' }}>
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
                      {getProductDetails(producto01).slice(14).map((item: string, idx: number) => {
                        // Si es un título (mayúsculas), renderizar como título
                        if (item === item.toUpperCase() && item.includes(' ')) {
                          return (
                            <div key={idx + 14} className="font-normal mt-2 first:mt-0" style={{ fontFamily: 'NCS' }}>
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

              {/* Contenedor de dos cards */}
              <div className="flex justify-between items-start h-full pr-0">
                {/* Card izquierdo */}
                {producto01 ? (
                  <div className="relative w-1/5" style={{ top: '240px' }}>
                    <a
                      href={`/product/${producto01.handle}`}
                      className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative h-[14rem] md:h-[20rem] w-full block cursor-pointer"
                    >
                      {/* Imagen del producto */}
                      <div className="relative w-full h-full">
                        <Image
                          src={producto01.featuredImage?.url || '/img1.jpg'}
                          alt={producto01.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Image
                          src={producto01.featuredImage?.url || '/img1.jpg'}
                          alt={producto01.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
                        />
                      </div>
                    </a>

                    {/* Tallas debajo del card del carrusel (producto 01) */}
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2 items-center">
                        {producto01.variants?.slice(0, 5).map((variant, i) => (
                          <span
                            key={i}
                            className={`${variant.availableForSale ? 'bg-black/10 text-black' : 'bg-black/5 text-black/40 line-through'} text-xs font-semibold px-2 py-2 rounded-full`}
                          >
                            {variant.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Card derecho */}
                {producto01 ? (
                  <div className="relative w-[79%] mb-0 self-end">
                    <a href={`/product/${producto01.handle}`} className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative h-[35rem] md:h-[28rem] w-full block cursor-pointer">
                      {/* Imagen del producto derecho */}
                      <div className="relative w-full h-full">
                        <Image
                          src={producto01?.featuredImage?.url || '/img1.jpg'}
                          alt={producto01?.title || 'Producto derecho'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Información del producto derecho */}
                      <div className="absolute top-6 left-6 right-2 hidden md:block">
                        <div className="flex flex-col justify-center">
                          <h3 className="text-sm font-medium text-white" style={{ fontFamily: 'Agressive' }}>
                            {producto01?.title}
                          </h3>
                        </div>
                      </div>

                      {/* Información del producto derecho (móvil) */}
                      <div className="absolute top-6 left-6 right-2 flex flex-col justify-center md:hidden">
                        <h3 className="text-sm font-medium text-white" style={{ fontFamily: 'Agressive' }}>
                          {producto01?.title}
                        </h3>
                      </div>

                      {/* Precio flotante centrado con botón circular pegado */}
                      <div className="absolute right-130 top-1/2 -translate-y-1/2">
                        <div className="flex items-center">
                          <div className="bg-black/50 text-white rounded-full px-4 py-2 backdrop-blur-sm flex items-center gap-10">
                            <span className="text-xs" style={{ fontFamily: 'Agressive' }}>{producto01?.title}</span>
                            <span className="text-sm font-semibold">{formatPrice(producto01?.priceRange?.maxVariantPrice)}</span>
                          </div>
                          <button className="ml-0 rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center justify-center px-2.5 py-2.5">
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                          </button>
                        </div>
                      </div>
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          

          {/* Segundo frosted card - Producto 02 (solo si existe) */}
          {producto02 && (
            <div className="max-w-7xl mx-auto flex justify-center">
              <div className="bg-white/50 backdrop-blur-xl rounded-3xl pl-5 pr-0 pt-8 pb-0 relative h-[35rem] md:h-[45rem] w-full max-w-7xl mt-12">
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

                {/* Número grande (02) */}
                <div className="absolute z-10 mt-2" style={{ top: '1rem', left: 'calc(20% + 2rem)' }}>
                  <span className="select-none leading-none" style={{ fontFamily: 'Agressive', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1, color: '#000000' }}>
                    02
                  </span>
                </div>

                {/* Bloque de detalles fijo para producto 02 */}
                <div className="absolute z-10 mt-3" style={{ top: '1rem', left: 'calc(25% + 10rem)' }}>
                  <h2 className="text-[11px] font-light" style={{ color: '#000000', fontFamily: 'Agressive' }}>{producto02?.title}</h2>
                  <p className="text-[11px] font-light" style={{ color: '#000000', opacity: 1, fontFamily: 'Agressive' }}>by shaded</p>
                  <div className="mt-3 text-[11px] leading-tight" style={{ color: '#000000', fontFamily: 'NCS' }}>
                    <div className="grid grid-cols-3 gap-4">
                      {/* Primera columna - primeros 7 elementos */}
                      <div className="space-y-2">
                        {getProductDetails(producto02).slice(0, 7).map((item: string, idx: number) => {
                          // Si es un título (mayúsculas), renderizar como título
                          if (item === item.toUpperCase() && item.includes(' ')) {
                            return (
                              <div key={idx} className="font-normal mt-2 first:mt-0" style={{ fontFamily: 'NCS' }}>
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
                        {getProductDetails(producto02).slice(7, 14).map((item: string, idx: number) => {
                          // Si es un título (mayúsculas), renderizar como título
                          if (item === item.toUpperCase() && item.includes(' ')) {
                            return (
                              <div key={idx + 7} className="font-normal mt-2 first:mt-0" style={{ fontFamily: 'NCS' }}>
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
                        {getProductDetails(producto02).slice(14).map((item: string, idx: number) => {
                          // Si es un título (mayúsculas), renderizar como título
                          if (item === item.toUpperCase() && item.includes(' ')) {
                            return (
                              <div key={idx + 14} className="font-normal mt-2 first:mt-0" style={{ fontFamily: 'NCS' }}>
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

                {/* Contenido interno dos cards */}
                <div className="flex justify-between items-start h-full pr-0">
                  {/* Card izquierdo (producto02) */}
                  <div className="relative w-1/5" style={{ top: '240px' }}>
                    <a
                      href={`/product/${producto02.handle}`}
                      className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative h-[14rem] md:h-[20rem] w-full block cursor-pointer"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={producto02.featuredImage?.url || '/img1.jpg'}
                          alt={producto02.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info breve izquierda */}
                      <div className="absolute bottom-2 left-2 right-2 flex flex-col justify-center md:hidden">
                        <h3 className="text-lg font-medium text-white">{producto02.title}</h3>
                      </div>
                    </a>

                    {/* Tallas debajo del card del carrusel (producto 02) */}
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2 items-center">
                        {producto02.variants?.slice(0, 4).map((variant, i) => (
                          <span
                            key={i}
                            className={`${variant.availableForSale ? 'bg-black/10 text-black' : 'bg-black/5 text-black/40 line-through'} text-xs font-semibold px-2 py-2 rounded-full`}
                          >
                            {variant.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card derecho del producto 02 */}
                  <div className="relative w-[79%] mb-0 self-end">
                    <a href={`/product/${producto02.handle}`} className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative h-[35rem] md:h-[28rem] w-full block cursor-pointer">
                      {/* Imagen del producto derecho */}
                      <div className="relative w-full h-full">
                        <Image
                          src={producto02?.featuredImage?.url || '/img1.jpg'}
                          alt={producto02?.title || 'Producto derecho 02'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Título overlay opcional */}
                      <div className="absolute top-6 left-6 right-2 hidden md:block">
                        <div className="flex flex-col justify-center">
                          <h3 className="text-sm font-medium text-white" style={{ fontFamily: 'Agressive' }}>
                            {producto02?.title}
                          </h3>
                        </div>
                      </div>

                      {/* Precio + botón anclado a la derecha */}
                      <div className="absolute right-130 top-1/2 -translate-y-1/2">
                        <div className="flex items-center">
                          <div className="bg-black/50 text-white rounded-full px-4 py-2 backdrop-blur-sm flex items-center gap-10">
                            <span className="text-xs" style={{ fontFamily: 'Agressive' }}>{producto02?.title}</span>
                            <span className="text-sm font-semibold">{formatPrice(producto02?.priceRange?.maxVariantPrice)}</span>
                          </div>
                          <button className="ml-0 rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center justify-center px-2.5 py-2.5">
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                          </button>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}