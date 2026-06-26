"use client";

export default function GoogleMap() {
  return (
    <section className="py-20 bg-base">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div
          className="overflow-hidden rounded-3xl border border-base"
          style={{
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <iframe
            src="https://www.google.com/maps?q=Dhanmondi,+Dhaka,+Bangladesh&output=embed"
            width="100%"
            height="500"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[350px] md:h-[450px] lg:h-[550px] border-0"
            title="MediCare Connect Location"
          />
        </div>
      </div>
    </section>
  );
}
