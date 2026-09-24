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
 * Two layers, not one. The ink and the screen fade quickly as `.core`, and the
 * colour alone extends much further as `.atmosphere`. A single opacity ramp from
 * near black to transparent must pass through grey, because dark composited over
 * cream at intermediate alpha is grey, and that produced a broad neutral halo
 * around the field. Separating chroma from darkness means the transition out of
 * the core reads as a muted violet or warm haze instead. The atmosphere sits
 * below the core, so inside the core nothing changes at all: the screen still
 * paints over the colour over the ink.
 *
 * This is a deliberate exception to the rule that everything shares one mask.
 * The ink and the screen still share theirs, which is the coupling that mattered.
 *
 * `data-motif` marks the node for tooling. `design-paper` reads fields from CSS
 * gradient backgrounds and its dot rule governs annotation clusters, so it
 * cannot score a dense display matrix and reports this node as unmeasured
 * instead of passing it silently. Guide: `alpha_tensor_homepage_motif_direction.md`.
 */

export const HeroMatrix = (): React.JSX.Element => (
  <span className={styles.field} data-motif="hero-field" aria-hidden="true">
    {/* Order matters: the atmosphere paints first and the core above it, so the
     * core stays opaque where it is at full strength and the atmosphere shows
     * only where the core has faded. */}
    <span className={styles.atmosphere} />
    <span className={styles.core} />
  </span>
);
