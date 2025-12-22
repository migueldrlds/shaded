import { getMetaobjects, getProduct, getProductRecommendations, getProducts } from 'lib/shopify';
import { Metadata } from 'next';
import ProductClient from './product-client';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    openGraph: {
      images: [
        {
          url: product.featuredImage?.url || product.images?.[0]?.url || '',
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description,
      images: [product.featuredImage?.url || product.images?.[0]?.url || ''],
      creator: '@shaded'
    },
  };
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
  // Tambien obtenemos los metaobjetos de color
  const [recommendedProducts, allProducts, colorsMetaobjects] = await Promise.all([
    getProductRecommendations(producto.id),
    getProducts({ sortKey: 'CREATED_AT', reverse: true }),
    // Intentamos con el tipo estándar de Shopify para colores
    getMetaobjects('shopify--color-pattern')
  ]);

  // Filtrar el producto actual de todos los productos
  const otherProducts = allProducts.filter(p => p.handle !== producto.handle).slice(0, 20);

  return (
    <ProductClient
      producto={producto}
      recommendedProducts={recommendedProducts.slice(0, 10)}
      otherProducts={otherProducts}
      colorsMetaobjects={colorsMetaobjects}
    />
  );
}