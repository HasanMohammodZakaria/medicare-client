import { getDoctorById } from "@/app/lib/actions/public.actions";
import BookingClient from "@/components/doctor/BookingClient";

import { notFound } from "next/navigation";

export const metadata = { title: "Book Appointment | MediNexa" };

export default async function BookingPage({ params }) {
  const { doctorId } = await params;
  const doctor = await getDoctorById(doctorId);
  if (!doctor) notFound();

  return <BookingClient doctor={doctor} />;
}
