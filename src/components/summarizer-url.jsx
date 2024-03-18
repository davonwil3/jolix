import { useState, React } from "react";

function SummaryAI() {
    const [summary, setSummary] = useState("");

    return (
        <div>
            <h1>Summary</h1>
            <div>
                <p>Summary of the article</p>
            </div>
        </div>
    );
}

export default SummaryAI;