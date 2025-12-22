import { getCollections } from './index';

export interface LatestCollection {
  title: string;
  handle: string;
}


export async function getLatestCollection(): Promise<LatestCollection> {

  let latestCollection: LatestCollection = { title: 'Serene', handle: 'serene' };

  try {
    const allCollections = await getCollections();


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

      const sortedCollections = collections.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      const latest = sortedCollections[0];

      if (latest) {

        const titleCase = latest.title
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');


        latestCollection = {
          title: titleCase,
          handle: latest.handle
        };
      }
    }
  } catch (error) {

  }

  return latestCollection;
}

