import React from "react";
import styles from "./HeroMatrix.module.css";

/**
 * The hero field: a soft chromatic surface viewed through a dot screen.
 *
 * The colour is in the substrate. Broad, heavily blurred radial fields carry a
 * muted navy and violet above, plum through the middle, ember and orange at the
 * lower right and a restrained oxblood at the lower left, all over the standard
 * ink. The dots are one neutral screen on top of that surface, one colour, one
 * pitch, one alpha, so a dot's appearance depends only on where it falls and
 * never on which region it belongs to.
 *
 * This is the inverse of the earlier model, which coloured the dots by region
 * and left the substrate flat. Measured, that read as a black grid carrying
 * coloured points, because at a 9px pitch the dots were separated enough to be
 * read as objects. Here the pitch is 6px, the dot is about a pixel, the screen
 * sits well under the threshold of a visible grid, and the surface is what the
 * eye resolves first.
 *
 * Everything is one element with one mask, so the substrate, the colour and the
 * screen fade together and the field dissolves into cream as a single object
 * rather than as several layers each showing its own edge.
 *
 * `data-motif` marks the node for tooling. `design-paper` reads fields from CSS
 * gradient backgrounds and its dot rule governs annotation clusters, so it
 * cannot score a dense display matrix and reports this node as unmeasured
 * instead of passing it silently. Guide: `alpha_tensor_homepage_motif_direction.md`.
 */

export const HeroMatrix = (): React.JSX.Element => (
  <span className={styles.field} data-motif="hero-field" aria-hidden="true">
    <span className={styles.surface} />
  </span>
);
