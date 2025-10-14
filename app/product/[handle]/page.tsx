import { getProduct } from 'lib/shopify';
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

  return <ProductClient producto={producto} />;
}