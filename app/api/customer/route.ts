import { getCustomer } from 'lib/shopify';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const customer = await getCustomer();
    
    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Get customer API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
