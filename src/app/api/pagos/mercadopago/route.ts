import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";


const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { carrito } = await req.json();

    // 🧾 Mapear productos
    const items = carrito.map((item: any) => ({
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: "ARS",
    }));

    // 🆔 Simular ID de orden (después lo mejoramos)
    const orderId = `ORD-${Date.now()}`;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items,

        external_reference: orderId,

        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/caja?status=success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/caja?status=error`,
        },

        auto_return: "approved",

        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({
      init_point: result.init_point,
      orderId,
    });

  } catch (error) {
    console.error("Error creando preferencia:", error);
    return NextResponse.json(
      { error: "Error creando pago" },
      { status: 500 }
    );
  }
}