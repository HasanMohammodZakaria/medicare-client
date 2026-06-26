import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import GoogleMap from "@/components/contact/GoogleMap";
import React from "react";

const ContactUsPage = () => {
  return (
    <div>
      <ContactHero />
      <ContactSection />
      <GoogleMap />
    </div>
  );
};

export default ContactUsPage;
