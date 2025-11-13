import { getCollections } from 'lib/shopify';
import ColeccionClient from '../../components/coleccion-client';

export default async function Coleccion() {
  // Obtener colecciones de Shopify
  const allCollections = await getCollections();
  
  // Debug: ver qué colecciones están llegando
  console.log('🔍 Colecciones de Shopify:', allCollections.map(c => c.title));
  
  // Filtrar colecciones - excluir "ALL" y otras colecciones no deseadas
  const collections = allCollections.filter(collection => 
    collection.title !== 'ALL' && 
    !collection.title.toLowerCase().includes('all') &&
    collection.title !== 'Home page' &&
    collection.title !== 'Featured products'
  );
  
  console.log('✅ Colecciones filtradas:', collections.map(c => c.title));

  // Convertir colecciones a formato para FlowingMenu
  const menuItems = [
    ...collections.map(collection => ({
      link: `/productos?coleccion=${collection.handle}`,
      text: collection.title.toUpperCase(),
      image: collection.image?.url || '/img1.jpg' // Usar imagen de la colección o imagen por defecto
    })),
    // Agregar Coming Soon como último elemento
    {
      link: '#',
      text: 'COMING SOON',
      image: '/img1.jpg' // Usar imagen por defecto para Coming Soon
    }
  ];

  return <ColeccionClient menuItems={menuItems} />;
}
