import HomeClient from 'components/home-client';
import { getCollectionProducts } from 'lib/shopify';
import { getLatestCollection } from 'lib/shopify/utils';

export default async function Home() {

  const latestCollection = await getLatestCollection();


  const trendingProducts = await getCollectionProducts({ collection: 'hidden-trending' });


  let productsToShow = trendingProducts.length > 0 ? trendingProducts : await getCollectionProducts({ collection: latestCollection.handle });


  if (productsToShow.length < 4) {
    const allProducts = await getCollectionProducts({ collection: 'all' });
    productsToShow = [...productsToShow, ...allProducts].slice(0, 10);
  }


  if (productsToShow.length > 0 && productsToShow.length < 4) {
    while (productsToShow.length < 6) {
      productsToShow = [...productsToShow, ...productsToShow];
    }
  }

  return <HomeClient latestCollection={latestCollection} trendingProducts={productsToShow.slice(0, 6)} />;
}
