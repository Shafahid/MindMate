import Blogs from "@/components/Blogs";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col font-[Nohemi]">
    <Hero/>
    <Features/>
    <HowItWorks/>
    <Blogs/>
    <Footer/>
    </div>
  );
}
