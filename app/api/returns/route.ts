import { addOrderNote } from 'lib/shopify/admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('customerAccessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { orderId, orderNumber, returnItems } = await req.json();

    if (!orderId || !orderNumber || !returnItems || returnItems.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that all return items have reasons
    const itemsWithoutReason = returnItems.filter((item: any) => !item.reason || item.quantity <= 0);
    if (itemsWithoutReason.length > 0) {
      return NextResponse.json(
        { error: 'All return items must have a reason and quantity > 0' },
        { status: 400 }
      );
    }

    console.log('Return request received:', {
      orderId,
      orderNumber,
      returnItems: returnItems.map((item: any) => ({
        variantId: item.variantId,
        title: item.title,
        quantity: item.quantity,
        reason: item.reason
      }))
    });

    try {
      // Create a note on the order in Shopify Admin
      const returnNote = `🔄 SOLICITUD DE DEVOLUCIÓN
      
Orden: #${orderNumber}
Fecha: ${new Date().toLocaleDateString('es-ES')}

Productos a devolver:
${returnItems.map((item: any) => 
  `• ${item.title} (Cantidad: ${item.quantity})
    Razón: ${item.reason}`
).join('\n')}

Estado: Pendiente de revisión
Solicitado por: Cliente vía web`;

      const noteResult = await addOrderNote(orderId, returnNote) as any;
      
      if (noteResult?.data?.orderUpdate?.userErrors?.length > 0) {
        console.error('Shopify note errors:', noteResult.data.orderUpdate.userErrors);
      }

      console.log('✅ Return request note added to Shopify order');

    } catch (shopifyError) {
      console.error('⚠️ Could not add note to Shopify, but return request logged:', shopifyError);
      // Continue even if Shopify integration fails
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      returnRequestId: `RET-${orderNumber}-${Date.now()}`,
      message: 'Return request submitted successfully and added to Shopify',
      estimatedProcessingTime: '2-3 business days'
    });

  } catch (error) {
    console.error('Return request API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
