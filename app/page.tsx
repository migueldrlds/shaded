import HomeClient from 'components/home-client';
import { getLatestCollection } from 'lib/shopify/utils';

export default async function Home() {
  // Obtener la colección más reciente de Shopify
  const latestCollection = await getLatestCollection();

  return <HomeClient latestCollection={latestCollection} />;
}
