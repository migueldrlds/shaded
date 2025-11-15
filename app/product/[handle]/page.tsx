import { getProduct, getProductRecommendations, getProducts } from 'lib/shopify';
import ProductClient from './product-client';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductoDetalle({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const producto = await getProduct(resolvedParams.handle);

  if (!producto) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
          <a
            href="/"
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Volver
          </a>
        </div>
      </div>
    );
  }

  // Obtener productos recomendados y todos los productos (excluyendo el actual)
  const [recommendedProducts, allProducts] = await Promise.all([
    getProductRecommendations(producto.id),
    getProducts({ sortKey: 'CREATED_AT', reverse: true })
  ]);

  // Filtrar el producto actual de todos los productos
  const otherProducts = allProducts.filter(p => p.handle !== producto.handle).slice(0, 20);

  return (
    <ProductClient 
      producto={producto} 
      recommendedProducts={recommendedProducts.slice(0, 10)}
      otherProducts={otherProducts}
    />
  );
}