import { customerActivate } from 'lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { customerId, activationToken, password } = await req.json();

    if (!customerId || !activationToken || !password) {
      return NextResponse.json(
        { error: 'Customer ID, activation token and password are required' },
        { status: 400 }
      );
    }

    // Validar que el código sea de 6 dígitos
    if (activationToken.length !== 6 || !/^\d{6}$/.test(activationToken)) {
      return NextResponse.json(
        { error: 'Activation token must be 6 digits' },
        { status: 400 }
      );
    }

    const result = await customerActivate(customerId, activationToken, password);

    if (result.errors) {
      return NextResponse.json(
        { errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      customer: result.customer
    });
  } catch (error) {
    console.error('Customer activation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
