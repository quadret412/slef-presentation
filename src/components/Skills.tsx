import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";

export function Skills() {
  return (
    <section
      id="skills"
      className="mx-auto max-w-[72rem] border-t border-line px-5 py-24 sm:px-8 sm:py-32"
    >
      <Reveal>
        <h2 className="text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Stack
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        {profile.skills.map((group, index) => (
          <Reveal key={group.group} delay={index * 0.05}>
            <div>
              <h3 className="text-[15px] font-medium text-steel">
                {group.group}
              </h3>
              <p className="mt-3 max-w-[42ch] text-[17px] leading-8 text-sand">
                {group.items.join("  ·  ")}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
