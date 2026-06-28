import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";

export async function POST(req) {
  const {
    doctorId,
    doctorName,
    consultationFee,
    appointmentDate,
    appointmentsTime,
    patientId,
    patientEmail,
  } = await req.json();

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patientEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Consultation with ${doctorName}`,
              description: `${appointmentDate} at ${appointmentsTime}`,
            },
            unit_amount: Math.round(parseFloat(consultationFee) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/doctors/${doctorId}`,
      metadata: {
        doctorId,
        patientId: patientId || "guest",
        appointmentDate,
        appointmentsTime,
        consultationFee: String(consultationFee),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}