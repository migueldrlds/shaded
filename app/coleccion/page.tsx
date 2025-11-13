import { getCollections } from 'lib/shopify';
import FlowingMenu from '../../components/FlowingMenu';

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

  // Convertir colecciones a formato para FlowingMenu
  const menuItems = [
    ...collections.map(collection => ({
      link: `/productos?coleccion=${collection.handle}`,
      text: collection.title.toUpperCase(),
      image: collection.image?.url || '/img1.jpg' // Usar imagen de la colección o imagen por defecto
    })),
    // Agregar Coming Soon como último elemento
    {
      link: '#',
      text: 'COMING SOON',
      image: '/img1.jpg' // Usar imagen por defecto para Coming Soon
    }
  ];

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

          {/* FlowingMenu de colecciones */}
          <div className="max-w-7xl mx-auto">
            <FlowingMenu items={menuItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
