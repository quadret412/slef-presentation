import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";

export function Projects() {
  return (
    <section
      className="border-t border-line px-5 py-12 sm:px-8 sm:py-16"
    >
      <Reveal>
        <h2 className="text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Selected work
        </h2>
      </Reveal>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {profile.projects.map((project) => (
          <Reveal key={project.name}>
            <article className="grid gap-6 py-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] md:gap-12">
              <div>
                <h3 className="text-[1.45rem] font-semibold tracking-[-0.025em]">
                  {project.name}
                </h3>
                <p className="mt-2 text-[13px] text-steel">{project.context}</p>
              </div>
              <div>
                <p className="max-w-[58ch] text-[17px] leading-[1.55] text-sand">
                  {project.oneLiner}
                </p>
                <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.6] text-sand-dim">
                  {project.outcome}
                </p>
                <p className="mt-5 text-[13px] text-sand-dim">
                  {project.stack.join("  ·  ")}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
