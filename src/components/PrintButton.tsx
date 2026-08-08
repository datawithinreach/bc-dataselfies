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
          inside it — @media print hides `.page` entirely (display: none) and shows
          only this. Nesting it inside `.page` instead (hidden via visibility, not
          display) was tried first and produced a spurious blank second page: the
          on-screen thank-you card's min-height:100vh layout still occupied page
          flow space even while invisible, and Chromium paginated for it. Tight
          viewBox (matching the portrait's own radius exactly) so the design bleeds
          to the full edge of the print area, the way a real button template expects. */}
      {createPortal(
        <div className="print-sheet" aria-hidden="true">
          <svg viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`} width="100%" height="100%">
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
