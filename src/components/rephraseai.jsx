import React, { useState } from "react";

function Rephraseai(props) {
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <div className="rephrase">
            <h1>Rephrase</h1>
            <p> Highlight text and select a category to rephrase.</p>
            <select value={selectedCategory} onChange={handleCategoryChange}  
                style={{
                        width: '200px',
                        height: '25px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '15px',
                        marginBottom: '5px',
                        marginTop: '-9px',
                }}>
                <option value="">Select a category</option>
                <option value="formal">Formal</option>
                <option value="informal">Informal</option>
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="persuasive">Persuasive</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="objective">Objective</option>
                <option value="inspirational">Inspirational</option>
                <option value="sarcastic-witty">Sarcastic/Witty</option>
                <option value="concerned-compassionate">Concerned/Compassionate</option>
                <option value="">None</option>
            </select>
            <button className="menu-submit-button"  onClick={() => props.func(selectedCategory)}>Rephrase</button>
        </div>
    );
}

export default Rephraseai;