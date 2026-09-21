import { CLUB } from "@/data/nbb";
import { estLienExterne } from "@/lib/utils";
import { IconFacebook, IconInstagram, IconWhatsapp } from "./icons";

/** Liens vers les réseaux sociaux du club. */
export function Socials({ compact = false }: { compact?: boolean }) {
  const liens = [
    { href: CLUB.facebook, label: "Facebook", Icon: IconFacebook },
    { href: CLUB.instagram, label: "Instagram", Icon: IconInstagram },
    { href: CLUB.whatsapp, label: compact ? "WhatsApp" : "Groupe WhatsApp", Icon: IconWhatsapp },
  ].filter((l) => estLienExterne(l.href));

  return (
    <div className={compact ? "socials socials--sm" : "socials"}>
      {liens.map(({ href, label, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener" className="social">
          <Icon size={compact ? 18 : 20} />
          {label}
          <span className="visually-hidden"> du Nantes Breil Basket (nouvel onglet)</span>
        </a>
      ))}
    </div>
  );
}
