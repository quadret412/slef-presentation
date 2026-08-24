import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <section className="border-t border-line px-5 py-12 sm:px-8 sm:py-16">
      <Reveal>
        <h2 className="text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Work
        </h2>
      </Reveal>
      <ol className="mt-8">
        {profile.experience.map((job, index) => (
          <li
            key={`${job.company}-${job.start}`}
            className="grid gap-4 border-t border-line py-10 md:grid-cols-[11rem_1fr] md:gap-12 lg:grid-cols-[13rem_1fr]"
          >
            <Reveal>
              <p className="tabular text-[13px] leading-6 text-sand-dim">
                {job.start} – {job.end}
                <span className="block">{job.duration}</span>
                <span className="block">{job.place}</span>
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <div>
                <h3 className="text-[1.35rem] font-semibold tracking-[-0.025em] text-sand">
                  {job.role}
                </h3>
                <p className="mt-1 text-[15px] text-steel">{job.company}</p>
                <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.6] text-sand-dim">
                  {job.summary}
                </p>
                <ul className="mt-5 max-w-[66ch] space-y-2.5">
                  {job.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="relative pl-4 text-[15px] leading-[1.55] text-sand before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-steel"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[13px] leading-6 text-sand-dim">
                  {job.tech.join("  ·  ")}
                </p>
              </div>
            </Reveal>
            <span className="sr-only">
              Role {index + 1} of {profile.experience.length}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
