import { getLatestCollection } from 'lib/shopify/utils';
import Header from './header';

export default async function HeaderWrapper({ transparent = false }: { transparent?: boolean }) {
  // Obtener la colección más reciente en el servidor
  const latestCollection = await getLatestCollection();

  return <Header transparent={transparent} latestCollection={latestCollection} />;
}
