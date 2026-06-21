import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HomeStats from "../components/home/HomeStats";
import Features from "../components/Features";
import HowItWorks from "../components/home/HowItWorks";
import SubjectsPreview from "../components/home/SubjectsPreview";
import WhyUstaad from "../components/home/WhyUstaad";
import Testimonials from "../components/home/Testimonials";
import HomeCTA from "../components/home/HomeCTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HomeStats />
      <Features />
      <HowItWorks />
      <SubjectsPreview />
      <WhyUstaad />
      <Testimonials />
      <HomeCTA />
      <Footer />
    </>
  );
}

export default Home;