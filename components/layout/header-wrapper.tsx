import { getCollections } from 'lib/shopify';
import Header from './header';

export default async function HeaderWrapper({ transparent = false }: { transparent?: boolean }) {
  // Obtener la colección más reciente en el servidor
  let latestCollection = { title: 'Introducing Serene', handle: 'serene' };
  
  try {
    const allCollections = await getCollections();
    console.log('🔍 Header - Colecciones de Shopify:', allCollections.map(c => c.title));
    
    // Filtrar colecciones - excluir "ALL" y otras colecciones no deseadas
    const collections = allCollections.filter(collection => {
      const title = collection.title.toLowerCase();
      const shouldInclude = (
        collection.title !== 'ALL' && 
        !title.includes('all') &&
        collection.title !== 'Home page' &&
        collection.title !== 'Featured products' &&
        collection.title !== 'All' &&
        collection.title !== 'ALL COLLECTIONS' &&
        collection.title !== 'All Collections'
      );
      
      if (!shouldInclude) {
        console.log(`❌ Excluyendo colección: "${collection.title}"`);
      }
      
      return shouldInclude;
    });
    
    console.log('✅ Header - Colecciones filtradas:', collections.map(c => c.title));
    
    if (collections && collections.length > 0) {
      // Ordenar por updatedAt para obtener la más reciente
      const sortedCollections = collections.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      const latest = sortedCollections[0];
      
      if (latest) {
        // Convertir a formato Title Case (primera letra de cada palabra mayúscula)
        const titleCase = latest.title
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        latestCollection = {
          title: titleCase,
          handle: latest.handle
        };
        
        console.log('🎯 Header - Colección seleccionada:', {
          original: latest.title,
          formatted: titleCase,
          handle: latest.handle,
          updatedAt: latest.updatedAt
        });
      }
    }
  } catch (error) {
    console.error('Error fetching collections:', error);
  }

  return <Header transparent={transparent} latestCollection={latestCollection} />;
}
