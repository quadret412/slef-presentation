import { profile } from "@/data/profile";
import { ResumeAlternate, ResumeDownload } from "./ResumeDownload";
import { Reveal } from "./Reveal";
import { SectionAnchor } from "./SectionAnchor";
import { SocialLinks } from "./SocialLinks";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-[72rem] border-t border-line px-5 py-12 sm:px-8 sm:py-16"
    >
      <SectionAnchor href="#contact" label="Contact" />
      <Reveal>
        <h2 className="max-w-none text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] sm:max-w-[16ch]">
          Let’s talk about the next frontend you need owned.
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-sand-dim">
          {profile.lookingFor} {profile.workMode}.
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <ResumeDownload
            className="inline-flex items-center gap-2 text-[15px] text-sand-dim transition-colors duration-200 hover:text-sand"
            label="Download PDF resume"
          />
          <ResumeAlternate className="text-[13px] text-sand-dim/70 underline-offset-4 transition-colors duration-200 hover:text-sand hover:underline" />
        </div>
      </Reveal>
      <footer className="mt-16 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <SocialLinks />
        <p className="px-2 text-[13px] text-sand-dim sm:px-0">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>
    </section>
  );
}
