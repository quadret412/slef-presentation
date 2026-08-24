import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";
import { SectionAnchor } from "./SectionAnchor";

export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-[72rem] border-t border-line px-5 py-12 sm:px-8 sm:py-16"
    >
      <SectionAnchor href="#about" label="About" />
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-24">
          <Reveal delay={0.05}>
            <h2 className="max-w-none text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] sm:max-w-[14ch]">
              Six years of Vue, owned end to end.
            </h2>
            <p className="mt-6 text-[15px] leading-7 text-sand-dim">
              {profile.lookingFor} {profile.headline.replaceAll(" · ", ", ")}.
            </p>
          </Reveal>
        </div>
        <div className="space-y-5">
          {profile.about.map((paragraph, index) => (
            <Reveal key={paragraph} delay={0.08 + index * 0.06}>
              <p className="max-w-[62ch] text-[17px] leading-[1.65] text-sand">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
