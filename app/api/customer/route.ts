import { getCustomer as getCustomerLegacy } from 'lib/shopify';
import { getCustomer as getCustomerFromCAAPI } from 'lib/shopify/customer-account-api';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('customerAccessToken')?.value;
    
    if (!accessToken) {
      return NextResponse.json({ customer: null });
    }

    // Try Customer Account API first (new OAuth flow)
    try {
      const customer = await getCustomerFromCAAPI(accessToken);
      
      if (customer) {
        // Transform to match legacy Customer type
        const transformedCustomer = {
          id: customer.id,
          email: customer.emailAddress?.emailAddress || '',
          firstName: customer.firstName || '',
          lastName: customer.lastName || '',
          phoneNumber: customer.phoneNumber?.phoneNumber || '',
        };
        
        return NextResponse.json({ customer: transformedCustomer });
      }
    } catch (error) {
      // If Customer Account API fails, try legacy API
      console.log('Customer Account API failed, trying legacy API:', error);
    }

    // Fallback to legacy API
    const customer = await getCustomerLegacy();
    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Get customer API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
