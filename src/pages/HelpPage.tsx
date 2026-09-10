import { Link } from "react-router-dom";
import shotForm from "../assets/help/01-submit-form.png";
import shotThankyou from "../assets/help/02-thankyou.png";
import shotWall from "../assets/help/03-display-wall.png";
import shotTooltip from "../assets/help/04-tooltip.png";
import shotPrintPanel from "../assets/help/05-print-panel.png";
import shotCluster from "../assets/help/06-cluster-picker.png";

interface Step {
  title: string;
  img: string;
  alt: string;
  body: string;
}

const STEPS: Step[] = [
  {
    title: "1. Fill out the questionnaire",
    img: shotForm,
    alt: "The submit form, showing the name field and the first multiple-choice question",
    body: "On the laptop, answer each question about yourself. Your name is only used to greet you on the next screen — it's never shown on the big screen.",
  },
  {
    title: "2. Meet your data selfie",
    img: shotThankyou,
    alt: "The thank-you screen showing a generated circular portrait, with Make another and Print for a button pin buttons",
    body: "Your answers turn into a small abstract portrait — a shape, colors, lines, and dots, each standing for one of your answers. It joins the wall on the big screen right away. Want to keep it? Print it and snap it into a button pin, then tap Make another to leave the screen ready for the next person.",
  },
  {
    title: "3. Find yourself on the wall",
    img: shotWall,
    alt: "The display wall showing several small circular portraits clustered together, with a legend panel on the right",
    body: "Everyone's portrait lives together on the big screen, clustered into groups. The panel on the right is the legend — it explains what every shape, color, and line means.",
  },
  {
    title: "4. Hover any portrait",
    img: shotTooltip,
    alt: "A tooltip over a portrait showing the person's name and answers, with a Click to print hint",
    body: "Hovering a portrait on the big screen shows who it belongs to and a summary of their answers.",
  },
  {
    title: "5. Click to reprint",
    img: shotPrintPanel,
    alt: "A panel with a person's details and a Print for a button pin button",
    body: "Clicking a portrait opens a panel with a Print for a button pin button — handy for reprinting a lost button pin straight from the big screen.",
  },
  {
    title: "6. Re-cluster the wall",
    img: shotCluster,
    alt: "The legend with the Parallel lines — continent section highlighted and marked as clustering",
    body: "Click any section header in the legend — school, continent, chronotype, whatever — to regroup the whole wall by that question instead.",
  },
];

export default function HelpPage() {
  return (
    <div className="help-page">
      <div className="help-header">
        <div>
          <h1>How BC Data Selfies works</h1>
          <p>A quick tour of the questionnaire and the live wall.</p>
        </div>
        <div className="help-header-actions">
          <button type="button" className="secondary" onClick={() => window.print()}>
            Print these instructions
          </button>
          <Link className="secondary" to="/submit">
            Back to the form
          </Link>
        </div>
      </div>

      <div className="help-steps">
        {STEPS.map((step) => (
          <div className="help-row" key={step.title}>
            <div className="help-shot">
              <img src={step.img} alt={step.alt} />
            </div>
            <div className="help-text">
              <h2>{step.title}</h2>
              <p>{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
