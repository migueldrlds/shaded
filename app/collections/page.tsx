import { getCollections } from 'lib/shopify';
import { Metadata } from 'next';
import ColeccionClient from '../../components/coleccion-client';

export const metadata: Metadata = {
  title: 'Our Collections',
  description: 'Explore our latest collections and find your perfect fit.'
};

export default async function Coleccion() {

  const allCollections = await getCollections();


  const collections = allCollections.filter(collection =>
    collection.title !== 'ALL' &&
    !collection.title.toLowerCase().includes('all') &&
    collection.title !== 'Home page' &&
    collection.title !== 'Featured products'
  );


  const menuItems = [
    ...collections.map(collection => ({
      link: `/products?collection=${collection.handle}`,
      text: collection.title.toUpperCase(),
      image: collection.image?.url || '/img1.jpg'
    })),

    {
      link: '#',
      text: 'COMING SOON',
      image: '/img1.jpg'
    }
  ];

  return <ColeccionClient menuItems={menuItems} />;
}
