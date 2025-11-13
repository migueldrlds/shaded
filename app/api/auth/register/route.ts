import { customerRegister } from 'lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const result = await customerRegister(firstName, lastName, email, password);

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
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
