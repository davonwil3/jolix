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

    const handleSubmit = (event) => {
        event.preventDefault();
        props.func(prompt, selectedOption);
    }

    return (
        <div className="ai-prompt">
            <h1>Generate content</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: "290px", alignItems: 'center', justifyContent: 'center' }}>
            <textarea
                style={{
                    width: '290px',
                    height: '140px',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '15px',
                }}
                placeholder="Ask jolix to help you generate content"
                onChange={handleInputChange}
                required
            />
            <label for="content-length" style={{fontSize: '15px', marginTop:'7px'}}>Select Content Length</label>
            <select 
                id="content-length"
                style={{
                    width: '220px',
                    height: '27px',
                    marginTop: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '15px',
                }}
                value={selectedOption}
                onChange={handleDropdownChange}
            >
                <option value="">Select size </option>
                <option value="Short">Short</option>
                <option value="Medium">Medium</option>
                <option value="Long">Long</option>
            </select>

            <button type="submit" className="menu-submit-button" >Generate</button>
            </form>
        </div>
    );
}

export default AiPrompt;