import { getCustomerOrders } from 'lib/shopify';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orders = await getCustomerOrders(20); // Obtener últimas 20 órdenes
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get customer orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
