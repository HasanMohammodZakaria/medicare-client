import {
  getCompletedAppointments,
  getMyReviews,
} from "@/app/lib/actions/patient.action";
import MyReviews from "@/components/patient/Reviews";

export const metadata = { title: "My Reviews | MediCare Connect" };

export default async function MyReviewsPage() {
  const [reviews, completedAppointments] = await Promise.all([
    getMyReviews(),
    getCompletedAppointments(),
  ]);

  return (
    <MyReviews
      initialReviews={reviews ?? []}
      completedAppointments={completedAppointments ?? []}
    />
  );
}
