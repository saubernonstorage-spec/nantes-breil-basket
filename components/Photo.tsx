import Image from "next/image";
import { initiales } from "@/lib/utils";
import { Terrain } from "@/components/Terrain";

type Props = {
  src?: string;
  alt: string;
  /** Largeur d'affichage, pour que le navigateur télécharge la bonne taille (ex. "(max-width: 700px) 100vw, 400px"). */
  sizes: string;
  /** Photo visible dès l'arrivée sur la page (grand bandeau) : chargée en priorité. */
  prioritaire?: boolean;
  /** Afficher la photo entière (logos, zoom) plutôt que de remplir le cadre. */
  entiere?: boolean;
  /** Ce qui s'affiche tant qu'aucune photo n'est fournie. */
  vide?: "terrain" | "rien" | { initiales: string } | { texte: string };
};

/**
 * Photo qui remplit son cadre (le parent doit être positionné et dimensionné).
 * Sans photo : un fond aux couleurs du club, pour que la page reste propre en attendant.
 */
export function Photo({ src, alt, sizes, prioritaire, entiere, vide = "terrain" }: Props) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={prioritaire}
        className={entiere ? "photo photo--entiere" : "photo"}
      />
    );
  }
  if (vide === "rien") return null;
  if (vide === "terrain") {
    return (
      <span className="photo-vide" aria-hidden="true">
        <Terrain motif="raquette" className="photo-vide__terrain" />
      </span>
    );
  }
  if ("initiales" in vide) {
    return (
      <span className="photo-vide photo-vide--initiales" aria-hidden="true">
        {initiales(vide.initiales)}
      </span>
    );
  }
  return (
    <span className="photo-vide photo-vide--texte" aria-hidden="true">
      {vide.texte}
    </span>
  );
}
