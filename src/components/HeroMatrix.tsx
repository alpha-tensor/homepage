import React, { useEffect, useRef, useState } from "react";
import styles from "./HeroMatrix.module.css";

/**
 * The hero field: a soft chromatic surface viewed through a dot screen.
 *
 * The colour is in the substrate. Broad, heavily blurred radial fields carry a
 * muted navy and violet above, plum through the middle, ember and orange at the
 * lower right and a restrained oxblood at the lower left, all over the standard
 * ink. The dots are one neutral screen on top of that surface, one colour, one
 * pitch, one profile, so a dot's appearance depends only on where it falls and
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
 * The visible shape is three overlapping masses rather than a faded rectangle,
 * because a rectangle with soft edges is still a rectangle. See the `--mass-*`
 * tokens in the stylesheet.
 *
 * Motion is ambient drift under a fixed matrix. The dot screen never moves, the ink
 * never moves and the masks never move; only the three colour groups drift, a few
 * percent, slowly enough that the surface reads as alive rather than animated. The
 * groups are addressed by offset tokens, so the drift is one custom property per
 * group rather than a DOM change.
 *
 * The observer below is a cost control, not a feature. A registered custom property
 * feeding `background-image` repaints the gradient stack every frame for as long as
 * it runs, so once the hero is off screen the animation is paused rather than left
 * burning. It is paused and not removed, so a resume holds the phase instead of
 * snapping to zero and replaying.
 *
 * `data-motif` marks the node for tooling. `design-paper` reads fields from CSS
 * gradient backgrounds and its dot rule governs annotation clusters, so it
 * cannot score a dense display matrix and reports this node as unmeasured
 * instead of passing it silently. Guide: `docs/design/homepage-motif-direction.md`.
 */

export const HeroMatrix = (): React.JSX.Element => {
  const field = useRef<HTMLSpanElement>(null);
  const [motion, setMotion] = useState<"running" | "paused">("running");

  useEffect(() => {
    const node = field.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setMotion(entry.isIntersecting ? "running" : "paused");
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={field}
      className={styles.field}
      data-motif="hero-field"
      data-motif-motion={motion}
      aria-hidden="true"
    >
      {/* Order matters: the atmosphere paints first and the core above it, so the
       * core stays opaque where it is at full strength and the atmosphere shows
       * only where the core has faded. */}
      <span className={styles.atmosphere} />
      <span className={styles.core} />
    </span>
  );
};
