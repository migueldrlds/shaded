import { getLatestCollection } from 'lib/shopify/utils';
import Header from './header';

export default async function HeaderWrapper({ transparent = false }: { transparent?: boolean }) {
  // Obtener la colección más reciente en el servidor
  const latestCollection = await getLatestCollection();
  
  // Agregar "Introducing" al título para el header
  const headerCollection = {
    title: `Introducing ${latestCollection.title}`,
    handle: latestCollection.handle
  };

  return <Header transparent={transparent} latestCollection={headerCollection} />;
}
