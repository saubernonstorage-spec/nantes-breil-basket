import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { CLUB, INSCRIPTIONS_OUVERTES, OUVERTURES_BOUTIQUE } from "@/data/nbb";
import { agendaAVenir } from "@/lib/nbb";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Apparitions } from "@/components/Apparitions";
import { BoutiqueFermee } from "@/components/BoutiqueFermee";
import { InscriptionsFermees } from "@/components/InscriptionsFermees";
import { ProchainEvenement } from "@/components/ProchainEvenement";
import "./globals.css";

// Polices téléchargées au moment de la construction et servies par le site : aucune requête vers Google.
// (Pas de police de repli ajustée pour Big Shoulders : Next ne connaît pas ses métriques.)
const titre = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-titre",
  display: "swap",
  adjustFontFallback: false,
});
const texte = Instrument_Sans({ subsets: ["latin"], variable: "--font-texte", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-mono", display: "swap" });

const description =
  "Club de basket associatif à Nantes (Breil / Hauts-Pavés) : école de mini-basket labellisée 3 étoiles et Micro Basket, école d'arbitrage, 28 équipes du micro-basket aux seniors, stages vacances et inscriptions en ligne.";

export const metadata: Metadata = {
  metadataBase: new URL(CLUB.siteUrl),
  title: {
    default: "Nantes Breil Basket — club de basket à Nantes, Breil / Hauts-Pavés",
    template: "%s — Nantes Breil Basket",
  },
  description,
  applicationName: CLUB.nom,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: CLUB.nom,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Nantes Breil Basket — club de basket à Nantes" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0A1733",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior : le défilement fluide (liens vers une section de la page) est coupé pendant les
    // changements de page, sinon Next.js ne ramène pas toujours la nouvelle page tout en haut.
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${titre.variable} ${texte.variable} ${mono.variable}`}
    >
      <body>
        <Header liens={{ boutique: CLUB.boutique, facebook: CLUB.facebook, instagram: CLUB.instagram, whatsapp: CLUB.whatsapp }} />
        <main id="contenu" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Apparitions />
        <BoutiqueFermee url={CLUB.boutique} ouvertures={OUVERTURES_BOUTIQUE} />
        {INSCRIPTIONS_OUVERTES ? null : <InscriptionsFermees />}
        {/* Les dates à venir au moment de la construction ; le navigateur choisit la prochaine d'après sa date. */}
        <ProchainEvenement dates={agendaAVenir()} />
      </body>
    </html>
  );
}
