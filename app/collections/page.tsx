import CollectionsClient from 'components/collections/collections-client';
import { getCollections } from 'lib/shopify';

export const metadata = {
  title: 'Collections',
  description: 'Explore our latest collections and drops.',
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return <CollectionsClient collections={collections} />;
}
