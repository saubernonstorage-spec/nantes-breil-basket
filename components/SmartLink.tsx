import Link from "next/link";
import type { ComponentProps } from "react";
import { estLienExterne } from "@/lib/utils";

type Props = Omit<ComponentProps<"a">, "href"> & { href: string };

/**
 * Lien intelligent : page du site (navigation instantanée), adresse web
 * externe (nouvel onglet, signalé aux lecteurs d'écran) ou mailto/tel.
 */
export function SmartLink({ href, children, ...rest }: Props) {
  if (estLienExterne(href)) {
    return (
      <a href={href} target="_blank" rel="noopener" {...rest}>
        {children}
        <span className="visually-hidden"> (nouvel onglet)</span>
      </a>
    );
  }
  if (/^(mailto:|tel:|#)/.test(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
