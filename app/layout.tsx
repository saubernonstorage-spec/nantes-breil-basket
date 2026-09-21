import type { Metadata, Viewport } from "next";
import { Anton, Barlow, Barlow_Condensed } from "next/font/google";
import { AncreAuChargement } from "@/components/AncreAuChargement";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CLUB, STATS } from "@/data/nbb";
import { IMAGE_PARTAGE } from "@/lib/seo";
import "./globals.css";

// Polices téléchargées à la construction du site puis servies par le site lui-même :
// aucune requête vers Google pour les visiteurs (RGPD).
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const barlow = Barlow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});
const barlowCondensed = Barlow_Condensed({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const DESCRIPTION = `Nantes Breil Basket : club de basket à Nantes, quartier Breil / Hauts-Pavés. École de mini-basket labellisée 3 étoiles, ${STATS.equipes} équipes du micro-basket aux seniors, planning des entraînements, stages des vacances et inscriptions.`;

export const metadata: Metadata = {
  metadataBase: new URL(CLUB.siteUrl),
  title: {
    default: "Nantes Breil Basket — club de basket à Nantes, quartier Breil / Hauts-Pavés",
    template: `%s — ${CLUB.nom}`,
  },
  description: DESCRIPTION,
  applicationName: CLUB.nom,
  keywords: [
    "basket Nantes",
    "club de basket Nantes",
    "Nantes Breil Basket",
    "NBB",
    "Breil",
    "Hauts-Pavés",
    "mini-basket Nantes",
    "école de basket",
    "stage basket vacances Nantes",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: CLUB.nom,
    title: "Nantes Breil Basket — club de basket à Nantes",
    description: DESCRIPTION,
    url: "/",
    images: [IMAGE_PARTAGE],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#071228",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${anton.variable} ${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <AncreAuChargement />
      </body>
    </html>
  );
}
