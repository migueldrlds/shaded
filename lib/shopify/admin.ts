// Shopify Admin API for returns and refunds
const ADMIN_API_VERSION = '2024-10';
const adminEndpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`;
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function shopifyAdminFetch<T>({
  query,
  variables
}: {
  query: string;
  variables?: any;
}): Promise<{ status: number; body: T }> {
  if (!adminAccessToken) {
    throw new Error('SHOPIFY_ADMIN_ACCESS_TOKEN not configured');
  }

  const result = await fetch(adminEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminAccessToken,
    },
    body: JSON.stringify({
      query,
      ...(variables && { variables })
    })
  });

  const body = await result.json();

  if (body.errors) {

    throw new Error(body.errors[0]?.message || 'Admin API error');
  }

  return {
    status: result.status,
    body
  };
}

// Create a return request in Shopify
export async function createReturnRequest(orderId: string, returnItems: any[]) {
  const mutation = `
    mutation returnCreate($return: ReturnInput!) {
      returnCreate(return: $return) {
        return {
          id
          name
          status
          totalQuantity
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Prepare line items for return
  const returnLineItems = returnItems.map(item => ({
    fulfillmentLineItemId: item.fulfillmentLineItemId || null,
    quantity: item.quantity,
    returnReason: item.reason || 'OTHER',
    returnReasonNote: item.reason
  }));

  const variables = {
    return: {
      orderId: orderId,
      returnLineItems: returnLineItems,
      requestedAt: new Date().toISOString(),
      notifyCustomer: false // No enviar emails
    }
  };

  try {
    const response = await shopifyAdminFetch({
      query: mutation,
      variables
    });

    return response.body;
  } catch (error) {

    throw error;
  }
}

// Create a note on the order for return request
export async function addOrderNote(orderId: string, note: string) {
  const mutation = `
    mutation orderUpdate($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
          note
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      id: orderId,
      note: note
    }
  };

  try {
    const response = await shopifyAdminFetch({
      query: mutation,
      variables
    });

    return response.body;
  } catch (error) {

    throw error;
  }
}
