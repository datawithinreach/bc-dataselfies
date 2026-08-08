import { createPortal } from "react-dom";
import type { ResponseRecord } from "../../shared/questions";
import PortraitMark from "./PortraitMark";

// Product spec for the clear snap-together button badges: 3" outer shell,
// 2.68" inner opening. Unlike a crimped metal pin-back button, nothing here
// folds under — the whole printed circle stays visible, it just has to
// physically clear the 2.68" opening to snap in. Printed a bit under that,
// not right up against the max, so it comfortably clears the opening even
// with imprecise scissor-cutting.
const DESIGN_IN = 2.5;
const R = 90;

export default function PrintButton({ record }: { record: ResponseRecord }) {
  return (
    <>
      <button type="button" className="secondary" onClick={() => window.print()}>
        Print for a button pin
      </button>

      {/* Portaled straight to <body>, as a sibling of the page rather than nested
          inside it — @media print hides `.page` entirely (display: none) and
          centers this within whatever paper size the print dialog actually uses
          (see the .print-sheet rules in styles.css; it deliberately does not try
          to force a custom small @page size — browsers don't honor that reliably
          and it ends up pinning the design in a page corner instead of centering
          it). Nesting it inside `.page` instead of portaling (hidden via
          visibility, not display) was tried first and produced a spurious blank
          second page: the on-screen thank-you card's min-height:100vh layout
          still occupied page-flow height even while invisible, and Chromium
          paginated for it. */}
      {createPortal(
        <div className="print-sheet" aria-hidden="true">
          {/* Fixed physical size (not 100%) so it prints at exactly DESIGN_IN
              regardless of the page it ends up centered on. Tight viewBox
              (matching the portrait's own radius exactly) so the design fills
              the full circle, no wasted margin inside its own bounds. */}
          <svg viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`} width={`${DESIGN_IN}in`} height={`${DESIGN_IN}in`}>
            <PortraitMark record={record} r={R} />
          </svg>
        </div>,
        document.body,
      )}
    </>
  );
}
