import { useState, React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnDownLeft } from '@fortawesome/pro-regular-svg-icons';

function Summarizer() {

  const [summary, setSummary] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = e.target[0].value;
    console.log(url);
  }

  return (
    <div className="summarizer-page">
      <h1>Summarize Articles</h1>
      <div className="summarizer-description">
        <p>Have jolix simplify your reading. Enter a website to transform lengthy
          articles into clear and concise summaries</p>
      </div>
      <form className="summarizer-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input type="url" className="input-url" placeholder="Enter a website" required />
          <button type="submit" className="icon-button">
            <FontAwesomeIcon icon={faArrowTurnDownLeft} />
          </button>
        </div>
      </form>

    </div>
  );
}
export default Summarizer;