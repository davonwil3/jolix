import React from "react";
import { useState } from "react";

function AiPrompt(props) {
    const [prompt, setPrompt] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    const handleInputChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className="ai-prompt">
            <h1>Generate content</h1>
            <textarea
                style={{
                    width: '320px',
                    height: '300px',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '15px',
                }}
                placeholder="Ask jolix to help you generate content"
                onChange={handleInputChange}
            />
            <label for="content-length" style={{fontSize: '15px', marginTop:'7px'}}>Select Content Length</label>
            <select 
                id="content-length"
                style={{
                    width: '200px',
                    height: '55px',
                    marginTop: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '15px',
                }}
                value={selectedOption}
                onChange={handleDropdownChange}
            >
                <option value="">Select size </option>
                <option value="option1">Short</option>
                <option value="option2">Medium</option>
                <option value="option3">Long</option>
            </select>

            <button className="menu-submit-button" onClick={() => props.func(prompt, selectedOption)}>Generate</button>
        </div>
    );
}

export default AiPrompt;