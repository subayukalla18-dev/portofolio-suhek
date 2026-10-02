import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
export default function Home() {
  return (
    <main id="home">
      <Navbar />

      <Hero />

      <About />

      <TechStack />

      <Projects />

      <Experience />

      <Certificates />

      <Contact />
    </main>
  );
}