import { getCollections } from './index';

export interface LatestCollection {
  title: string;
  handle: string;
}

/**
 * Obtiene la colección más reciente de Shopify
 * Filtra colecciones no deseadas y ordena por updatedAt
 */
export async function getLatestCollection(): Promise<LatestCollection> {
  // Valor por defecto
  let latestCollection: LatestCollection = { title: 'Serene', handle: 'serene' };
  
  try {
    const allCollections = await getCollections();
    
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
      
      return shouldInclude;
    });
    
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
        
        // Mostrar solo el nombre de la colección (sin "Introducing")
        latestCollection = {
          title: titleCase,
          handle: latest.handle
        };
      }
    }
  } catch (error) {
    // Error fetching latest collection
  }
  
  return latestCollection;
}

