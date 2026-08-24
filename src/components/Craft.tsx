import { BrandStudio } from "./BrandStudio";
import { LiveDesk } from "./LiveDesk";
import { LiveFeed } from "./LiveFeed";
import { Reveal } from "./Reveal";
import { SectionAnchor } from "./SectionAnchor";
import { TechDock } from "./TechDock";

export function Craft() {
  return (
    <section
      id="craft"
      className="relative mx-auto max-w-[72rem] border-t border-line px-5 py-12 sm:px-8 sm:py-16"
    >
      <SectionAnchor href="#craft" label="Craft" />
      <Reveal>
        <h2 className="max-w-none text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] sm:max-w-[16ch]">
          Touch the work, not just the résumé.
        </h2>
      </Reveal>
      <Reveal delay={0.06}>
        <p className="mt-4 max-w-[54ch] text-[17px] leading-[1.6] text-sand-dim">
          Tokens, a wallet sheet, a live feed, a crate reel, a stack you can
          drag, and an upgrader on those marks - the kind of UI I ship,
          compressed into this page.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <h3 className="text-[15px] font-medium text-steel">Brand tokens</h3>
          <p className="mt-2 mb-4 text-[14px] leading-6 text-sand-dim">
            Switch skins. The tree stays. Open wallet for the real sheet.
          </p>
          <BrandStudio />
        </Reveal>
        <Reveal delay={0.06}>
          <h3 className="text-[15px] font-medium text-steel">Realtime desk</h3>
          <p className="mt-2 mb-4 text-[14px] leading-6 text-sand-dim">
            Wallet, live count, crate reveal over a synthetic socket.
          </p>
          <LiveDesk />
        </Reveal>
      </div>

      <div className="mt-8">
        <Reveal>
          <h3 className="text-[15px] font-medium text-steel">Live drop</h3>
          <p className="mt-2 mb-4 text-[14px] leading-6 text-sand-dim">
            Newest wins land first. The rail carries them off.
          </p>
        </Reveal>
        <LiveFeed />
      </div>

      <div className="mt-8">
        <Reveal>
          <h3 className="text-[15px] font-medium text-steel">Stack</h3>
          <p className="mt-2 mb-4 text-[14px] leading-6 text-sand-dim">
            Click a mark or drag it onto the target. Tiles can grow to 5×5.
          </p>
        </Reveal>
        <TechDock />
      </div>
    </section>
  );
}
