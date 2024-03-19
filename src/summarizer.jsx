import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnDownLeft } from '@fortawesome/pro-regular-svg-icons';
import axios from 'axios';

function Summarizer() {

  const [summaries, setSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);

  useEffect(() => {
    const loadedSummaries = JSON.parse(localStorage.getItem('summaries')) || [];
    setSummaries(loadedSummaries);
  }, []);

  useEffect(() => {
    localStorage.setItem('summaries', JSON.stringify(summaries));
    console.log('Summaries:', summaries);
  }, [summaries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = e.target[0].value;

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/summarize`, { url: url })
    .then((response) => {
      console.log("Response:", response); // Log the entire response object to debug
      const newSummary = { url: url, summary: response.data.summary };
      console.log("New Summary:", newSummary); // Log the new summary to debug
      let updatedSummaries = [...summaries, newSummary];
      if (updatedSummaries.length > 11) {
        updatedSummaries = updatedSummaries.slice(updatedSummaries.length - 11);
      }
      setSummaries(updatedSummaries);
      setSelectedSummary(newSummary);
    })
    .catch((error) => {
      console.error(error);
    });
    
  };

  return (
    <div className="summarizer-page">
      <h1>Summarize Articles</h1>
      <div className="summarizer-description">
        <p>Have jolix simplify your reading. Enter a website to transform lengthy articles into clear and concise summaries</p>
      </div>
      <form className="summarizer-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input type="url" className="input-url" placeholder="Enter a website" required />
          <button type="submit" className="icon-button">
            <FontAwesomeIcon icon={faArrowTurnDownLeft} />
          </button>
        </div>
      </form>
      <div className="summaries-list">
        {summaries.map((summary, index) => (
          <div key={index} className="summary-item" onClick={() => setSelectedSummary(summary)}>
            {summary.url}
          </div>
        ))}
      </div>
      {selectedSummary && (
        <div className="selected-summary">
          <p>{selectedSummary.summary}</p>
        </div>
      )}
    </div>
  );
}

export default Summarizer;
