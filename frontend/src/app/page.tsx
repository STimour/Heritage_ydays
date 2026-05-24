import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Showcase from "@/components/landing/Showcase";
import Testimonial from "@/components/landing/Testimonial";
import FinalCTA from "@/components/landing/FinalCTA";

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <Testimonial />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
