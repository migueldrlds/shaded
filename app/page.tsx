import HomeClient from 'components/home-client';
import { getCollectionProducts } from 'lib/shopify';
import { getLatestCollection } from 'lib/shopify/utils';

export default async function Home() {
  // Obtener la colección más reciente de Shopify
  const latestCollection = await getLatestCollection();

  // Obtener productos "Trending" (podemos usar una colección específica 'frontpage' o 'trending')
  // Si no existe, usamos 'all' y tomamos los primeros
  const trendingProducts = await getCollectionProducts({ collection: 'hidden-trending' });

  // Si no hay trending, fallback a la colección más reciente
  let productsToShow = trendingProducts.length > 0 ? trendingProducts : await getCollectionProducts({ collection: latestCollection.handle });

  // Si aún son pocos, traemos de 'all'
  if (productsToShow.length < 4) {
    const allProducts = await getCollectionProducts({ collection: 'all' });
    productsToShow = [...productsToShow, ...allProducts].slice(0, 10);
  }

  // Si AÚN son pocos (menos de 4), duplicamos los que hay para rellenar la UI
  if (productsToShow.length > 0 && productsToShow.length < 4) {
    while (productsToShow.length < 6) {
      productsToShow = [...productsToShow, ...productsToShow];
    }
  }

  return <HomeClient latestCollection={latestCollection} trendingProducts={productsToShow.slice(0, 6)} />;
}
