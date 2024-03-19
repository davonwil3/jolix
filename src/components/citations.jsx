import React, { useState } from 'react';

const Citations = () => {
    const [citationType, setCitationType] = useState('web');
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [publisher, setPublisher] = useState('');
    const [year, setYear] = useState('');
    const [websiteTitle, setWebsiteTitle] = useState('');
    const [url, setUrl] = useState('');
    const [publicationDate, setPublicationDate] = useState('');
    const [citationFormat, setCitationFormat] = useState('');
    const [citationVisibility, setCitationVisibility] = useState(false);

    const handleCitationTypeChange = (event) => {
        setCitationType(event.target.value);
    };

    const handleGenerateCitation = () => {
        setCitationVisibility(true);
    };

    return (
        <div className='citations'>
            <h1>Citation Form</h1>
            {citationVisibility && (
                <div className='citation-result'>
                    <label htmlFor="citationType">Citation Result</label>
                    <textarea placeholder="Citation" />
                </div>
            )}
            <label htmlFor="citationType">Citation Type:</label>
            <select id="citationType" value={citationType} onChange={handleCitationTypeChange}
                style={{
                    width: '290px',
                    height: '32px',
                    marginTop: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '15px',
                    color: '#757575',
                    paddingLeft: '5px',



                }}>
                <option value="">Select Type</option>
                <option value="book">Book</option>
                <option value="web">Web</option>
            </select>

            {citationType === 'book' && (
                <div className='inputs-citation'>
                    <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="text" placeholder="Publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
                    <input type="text" placeholder="Year of Publication" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
            )}

            {citationType === 'web' && (
                <div className='inputs-citation'>
                    <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="text" placeholder="Website Title" value={websiteTitle} onChange={(e) => setWebsiteTitle(e.target.value)} />
                    <input type="text" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
                    <input type="text" placeholder="Publication Date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} />
                </div>
            )}

            <label htmlFor="citationFormat">Citation Format:</label>
            <select id="citationFormat" value={citationFormat} onChange={(e) => setCitationFormat(e.target.value)}
                style={{
                    width: '290px',
                    height: '32px',
                    marginTop: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '15px',
                    color: '#757575',
                    paddingLeft: '5px',
                }}>
                <option value="">Select Format</option>
                <option value="apa">APA</option>
                <option value="mla">MLA</option>
                <option value="chicago">Chicago</option>
            </select>

            <button className="menu-submit-button" style={{ width: '145px' }} onClick={handleGenerateCitation}>Generate Citation</button>


        </div>
    );
};

export default Citations;

