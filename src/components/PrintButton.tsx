import { createPortal } from "react-dom";
import type { ResponseRecord } from "../../shared/questions";
import PortraitMark from "./PortraitMark";

// Standard convention for a 2.25" pin-back button: print the design at 3"
// so there's bleed for the machine to crimp/fold around the pin backing.
const BLEED_IN = 3;
const BUTTON_IN = 2.25;
const R = 90;
const GUIDE_R = R * (BUTTON_IN / BLEED_IN);

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
          {/* Fixed physical size (not 100%) so it prints at exactly BLEED_IN
              regardless of the page it ends up centered on. Tight viewBox
              (matching the portrait's own radius exactly) so the design bleeds
              to the full edge of this circle, the way a real button template
              expects. */}
          <svg viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`} width={`${BLEED_IN}in`} height={`${BLEED_IN}in`}>
            <PortraitMark record={record} r={R} />
            {/* Faint cut-line guide at the button's visible face (2.25"), inset from
                the 3" bleed edge — helpful whether you're using a machine's punch or
                cutting by hand; it sits in the ring that gets folded under the pin
                backing either way. */}
            <circle r={GUIDE_R} fill="none" stroke="#00000040" strokeWidth={0.75} strokeDasharray="3 3" />
          </svg>
        </div>,
        document.body,
      )}
    </>
  );
}
