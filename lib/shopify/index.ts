import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS
} from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import { ensureStartsWith } from 'lib/utils';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag
} from 'next/cache';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import {
  customerAccessTokenCreateMutation,
  customerAccessTokenDeleteMutation,
  customerActivateMutation,
  customerCreateMutation,
  customerRecoverMutation
} from './mutations/customer';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getCustomerOrdersQuery, getCustomerQuery } from './queries/customer';
import { getMenuQuery } from './queries/menu';
import { getMetaobjectsQuery } from './queries/metaobject';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from './queries/product';
import {
  Cart,
  Collection,
  Connection,
  Customer,
  Image,
  Menu,
  Metaobject,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyCustomerAccessTokenCreateOperation,
  ShopifyCustomerAccessTokenDeleteOperation,
  ShopifyCustomerActivateOperation,
  ShopifyCustomerCreateOperation,
  ShopifyCustomerOperation,
  ShopifyCustomerRecoverOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

export async function shopifyFetch<T>({
  headers,
  query,
  variables
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

export async function getMetaobjects(type: string = 'color'): Promise<Metaobject[]> {
  const res = await shopifyFetch<any>({
    query: getMetaobjectsQuery,
    variables: {
      type,
      first: 100
    }
  });

  const metaobjects = removeEdgesAndNodes(res.body?.data?.metaobjects || { edges: [] });

  return metaobjects.map((obj: any) => {
    const fields: Record<string, any> = {};
    obj.fields.forEach((field: any) => {
      if (field.reference?.image) {
        fields[field.key] = field.reference.image;
      } else {
        fields[field.key] = field.value;
      }
    });

    return {
      handle: obj.handle,
      ...fields
    };
  }) as Metaobject[];
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: cart.cost.totalAmount.currencyCode
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (
  collection: ShopifyCollection
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    }
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    }
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    }
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId }
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  if (!res.body.data.collection) {
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}

export async function getCollections(): Promise<Collection[]> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: {
      handle
    }
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, '')
        .replace('/collections', '/search')
        .replace('/pages', '')
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    'collections/create',
    'collections/delete',
    'collections/update'
  ];
  const productWebhooks = [
    'products/create',
    'products/delete',
    'products/update'
  ];
  const topic = (await headers()).get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

// Customer Authentication Functions
export async function customerLogin(email: string, password: string): Promise<{ accessToken?: string; errors?: string[] }> {
  try {
    const res = await shopifyFetch<ShopifyCustomerAccessTokenCreateOperation>({
      query: customerAccessTokenCreateMutation,
      variables: {
        input: {
          email,
          password
        }
      }
    });

    const { customerAccessToken, customerUserErrors } = res.body.data.customerAccessTokenCreate;

    if (customerUserErrors.length > 0) {
      return {
        errors: customerUserErrors.map(error => error.message)
      };
    }

    if (customerAccessToken) {
      // Store the access token in cookies
      const cookieStore = await cookies();
      cookieStore.set('customerAccessToken', customerAccessToken.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      return {
        accessToken: customerAccessToken.accessToken
      };
    }

    return {
      errors: ['Login failed']
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      errors: ['An error occurred during login']
    };
  }
}

export async function customerLogout(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('customerAccessToken')?.value;

    if (accessToken) {
      // Delete the access token from Shopify
      await shopifyFetch<ShopifyCustomerAccessTokenDeleteOperation>({
        query: customerAccessTokenDeleteMutation,
        variables: {
          customerAccessToken: accessToken
        }
      });
    }

    // Remove the cookie
    cookieStore.delete('customerAccessToken');

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
}

export async function customerRegister(firstName: string, lastName: string, email: string, password: string): Promise<{ customer?: Customer; errors?: string[] }> {
  try {
    const res = await shopifyFetch<ShopifyCustomerCreateOperation>({
      query: customerCreateMutation,
      variables: {
        input: {
          firstName,
          lastName,
          email,
          password,
          acceptsMarketing: false
        }
      }
    });

    const { customer, customerUserErrors } = res.body.data.customerCreate;

    if (customerUserErrors.length > 0) {
      return {
        errors: customerUserErrors.map(error => error.message)
      };
    }

    return { customer };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      errors: ['An error occurred during registration']
    };
  }
}

export async function getCustomer(): Promise<Customer | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('customerAccessToken')?.value;

    if (!accessToken) {
      return null;
    }

    const res = await shopifyFetch<ShopifyCustomerOperation>({
      query: getCustomerQuery,
      variables: {
        customerAccessToken: accessToken
      }
    });

    return res.body.data.customer || null;
  } catch (error) {
    console.error('Get customer error:', error);
    return null;
  }
}

export async function customerForgotPassword(email: string): Promise<{ success: boolean; errors?: string[] }> {
  try {
    const res = await shopifyFetch<ShopifyCustomerRecoverOperation>({
      query: customerRecoverMutation,
      variables: {
        email
      }
    });

    const { customerUserErrors } = res.body.data.customerRecover;

    if (customerUserErrors.length > 0) {
      return {
        success: false,
        errors: customerUserErrors.map(error => error.message)
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      errors: ['An error occurred while processing your request']
    };
  }
}

export async function getCustomerOrders(first: number = 10): Promise<any[]> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('customerAccessToken')?.value;

    if (!accessToken) {
      return [];
    }

    const res = await shopifyFetch<any>({
      query: getCustomerOrdersQuery,
      variables: {
        customerAccessToken: accessToken,
        first
      }
    });

    const customer = (res.body as any).data?.customer;

    if (!customer?.orders?.edges) {
      return [];
    }

    return customer.orders.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Get customer orders error:', error);
    return [];
  }
}

export async function customerActivate(
  customerId: string,
  activationToken: string,
  password: string
): Promise<{ accessToken?: string; customer?: Customer; errors?: string[] }> {
  try {
    const res = await shopifyFetch<ShopifyCustomerActivateOperation>({
      query: customerActivateMutation,
      variables: {
        id: customerId,
        input: {
          activationToken,
          password
        }
      }
    });

    const { customer, customerAccessToken, customerUserErrors } = res.body.data.customerActivate;

    if (customerUserErrors.length > 0) {
      return {
        errors: customerUserErrors.map(error => error.message)
      };
    }

    if (customerAccessToken && customer) {
      // Store the access token in cookies
      const cookieStore = await cookies();
      cookieStore.set('customerAccessToken', customerAccessToken.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      return {
        accessToken: customerAccessToken.accessToken,
        customer
      };
    }

    return {
      errors: ['Activation failed']
    };
  } catch (error) {
    console.error('Customer activation error:', error);
    return {
      errors: ['An error occurred during activation']
    };
  }
}
