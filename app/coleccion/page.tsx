import { getCollections } from 'lib/shopify';
import Image from 'next/image';
import Link from 'next/link';

export default async function Coleccion() {
  // Obtener colecciones de Shopify
  const allCollections = await getCollections();
  
  // Debug: ver qué colecciones están llegando
  console.log('🔍 Colecciones de Shopify:', allCollections.map(c => c.title));
  
  // Filtrar colecciones - excluir "ALL" y otras colecciones no deseadas
  const collections = allCollections.filter(collection => 
    collection.title !== 'ALL' && 
    !collection.title.toLowerCase().includes('all') &&
    collection.title !== 'Home page' &&
    collection.title !== 'Featured products'
  );
  
  console.log('✅ Colecciones filtradas:', collections.map(c => c.title));

  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: '#d2d5d3' }}>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Título de la página */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C', fontFamily: 'Agressive' }}>
              COLLECTIONS
            </h1>
            <p className="text-lg font-light" style={{ color: '#2E2E2C', opacity: 0.7 }}>
              Descubre nuestra selección de prendas esenciales
            </p>
          </div>

          {/* Grid de colecciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Colecciones de Shopify */}
            {collections.map((collection) => (
              <Link
                key={collection.handle}
                href={`/productos?coleccion=${collection.handle}`}
                className="relative overflow-hidden rounded-[60px] lg:rounded-[40px] h-[28rem] block cursor-pointer group"
              >
                {collection.image ? (
                  <Image 
                    src={collection.image.url} 
                    alt={collection.image.altText || collection.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
                  <h1 className="text-4xl font-medium text-white text-center" style={{ fontFamily: 'Agressive' }}>
                    {collection.title.toUpperCase()}
                  </h1>
                </div>
              </Link>
            ))}

            {/* Card Coming Soon - Siempre al final */}
            <div className="relative overflow-hidden rounded-[60px] lg:rounded-[40px] h-[28rem] block">
              <Image src="/img1.jpg" alt="Coming Soon" fill className="object-cover blur-sm" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-4xl font-medium text-white text-center" style={{ fontFamily: 'Agressive' }}>COMING SOON</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
