import { getCustomerOrders } from 'lib/shopify';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orders = await getCustomerOrders(20);

    return NextResponse.json({ orders });
  } catch (error) {

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
