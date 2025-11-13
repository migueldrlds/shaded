import { shopifyFetch } from 'lib/shopify';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Query GraphQL más detallado para una orden específica
const getOrderDetailQuery = /* GraphQL */ `
  query getOrderDetail($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 250) {
        edges {
          node {
            id
            orderNumber
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            statusUrl
            fulfillmentStatus
            financialStatus
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
            }
            lineItems(first: 250) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                      width
                      height
                    }
                    product {
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const resolvedParams = await params;
    
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('customerAccessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      );
    }

    const res = await shopifyFetch<any>({
      query: getOrderDetailQuery,
      variables: {
        customerAccessToken: accessToken
      }
    });

    const customer = (res.body as any).data?.customer;
    
    if (!customer?.orders?.edges) {
      return NextResponse.json(
        { error: 'No orders found' },
        { status: 404 }
      );
    }

    // Buscar la orden específica
    const order = customer.orders.edges
      .map((edge: any) => edge.node)
      .find((order: any) => 
        order.orderNumber.toString() === resolvedParams.id ||
        order.id.includes(resolvedParams.id)
      );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
