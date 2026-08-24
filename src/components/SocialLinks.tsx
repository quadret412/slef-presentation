import { profile } from "@/data/profile";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "./Icons";

const links = [
  {
    href: `mailto:${profile.email}`,
    label: `Email ${profile.email}`,
    Icon: MailIcon,
    external: false,
  },
  {
    href: profile.telegram,
    label: `Telegram ${profile.telegramHandle}`,
    Icon: TelegramIcon,
    external: true,
  },
  {
    href: profile.whatsapp,
    label: `WhatsApp ${profile.whatsappLabel}`,
    Icon: WhatsAppIcon,
    external: true,
  },
  {
    href: profile.linkedin,
    label: "LinkedIn",
    Icon: LinkedInIcon,
    external: true,
  },
  {
    href: profile.github,
    label: "GitHub",
    Icon: GitHubIcon,
    external: true,
  },
] as const;

export function SocialLinks({
  className = "",
  tone = "page",
}: {
  className?: string;
  tone?: "page" | "inherit";
}) {
  const itemClass =
    tone === "page"
      ? "text-sand-dim hover:bg-fill hover:text-sand"
      : "text-current hover:bg-black/5 hover:opacity-80";

  return (
    <ul className={`flex items-center gap-0.5 ${className}`.trim()}>
      {links.map(({ href, label, Icon, external }) => (
        <li key={href}>
          <a
            href={href}
            aria-label={label}
            title={label}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-[color,background,transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel/50 ${itemClass}`}
          >
            <Icon className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
