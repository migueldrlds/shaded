import { customerLogout } from 'lib/shopify';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const result = await customerLogout();

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Logout failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
