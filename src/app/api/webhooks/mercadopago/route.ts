import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🧠 Solo procesamos pagos
    if (body.type === "payment") {
      const payment = new Payment(client);

      const paymentData = await payment.get({
        id: body.data.id,
      });

      console.log("Pago recibido:", paymentData);

      if (paymentData.status === "approved") {
        const orderId = paymentData.external_reference;

        console.log(" Pago aprobado para orden:", orderId);

        //  ACA después vamos a:
        // - actualizar DB
        // - descontar stock
        // - marcar venta como pagada
      }
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Error webhook:", error);
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}