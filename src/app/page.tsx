import { About } from "@/components/About";
import { Atmosphere } from "@/components/Atmosphere";
import { Contact } from "@/components/Contact";
import { Craft } from "@/components/Craft";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Metrics } from "@/components/Metrics";
import { AppChrome } from "@/components/AppChrome";
import { Projects } from "@/components/Projects";
import { SectionAnchor } from "@/components/SectionAnchor";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Atmosphere />
      <AppChrome>
        <main className="min-w-0 overflow-x-clip pb-24 md:pb-0">
          <Hero />
          <About />
          <Metrics />
          <Craft />
          <div id="work" className="relative mx-auto max-w-[72rem]">
            <SectionAnchor href="#work" label="Work" />
            <Experience />
            <Projects />
          </div>
          <Contact />
        </main>
      </AppChrome>
    </div>
  );
}
