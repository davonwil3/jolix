import axios from 'axios';
import React, { useState } from 'react';

const Citations = () => {
    const [citationType, setCitationType] = useState('Book');
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [publisher, setPublisher] = useState('');
    const [year, setYear] = useState('');
    const [websiteTitle, setWebsiteTitle] = useState('');
    const [url, setUrl] = useState('');
    const [publicationDate, setPublicationDate] = useState('');
    const [citationFormat, setCitationFormat] = useState('apa');
    const [citationVisibility, setCitationVisibility] = useState(false);
    const [citation, setCitation] = useState('');

    const handleCitationTypeChange = (event) => {
        if (event.target.value === '') {
            setCitationType('Book');
            return;
        }
        setCitationType(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleGenerateCitation();
    };
    const handleGenerateCitation = () => {
        let citationObject = {}

        if (citationType === 'Book') {
            citationObject.author = author;
            citationObject.title = title;
            citationObject.publisher = publisher;
            citationObject.yearOfPublication = year;
        }
        else if (citationType === 'Web') {
            citationObject.author = author;
            citationObject.title = title;
            citationObject.websiteTitle = websiteTitle;
            citationObject.url = url;
            citationObject.publicationDate = publicationDate;
        }

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/generate-citation`, {
            citationType: citationType,
            format: citationFormat,
            citationObject: citationObject
        })
            .then((response) => {
                console.log("Response:", response);
                setCitation(response.data.citation);
            })
            .catch((error) => {
                console.error(error);
            });
        setCitationVisibility(true);
    };

    return (
        <div className='citations'>
            <h1>Citation Form</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: "290px", alignItems: 'center', justifyContent: 'center' }}>
                {citationVisibility && (
                    <div className='citation-result'>
                        <label htmlFor="citationType">Citation Result</label>
                        <textarea value={citation} placeholder="Citation" contentEditable={true} onChange={(e) => setCitation(e.target.value)} />
                    </div>
                )}
                <label htmlFor="citationType">Citation Type:</label>
                <select id="citationType" value={citationType} onChange={handleCitationTypeChange} required
                    style={{
                        width: '290px',
                        height: '32px',
                        marginTop: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '15px',
                        color: '#757575',
                        paddingLeft: '5px',
                    }}
                    onInvalid={e => e.target.setCustomValidity("You must pick an option.")}
                    onInput={e => e.target.setCustomValidity("")}
                >
                    <option value="">Select Type</option>
                    <option value="Book">Book</option>
                    <option value="Web">Web</option>
                </select>

                {(citationType === 'Book' || citationType === '') && (
                    <div className='inputs-citation'>
                        <input type="text" required placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                        <input type="text" required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input type="text" required placeholder="Publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
                        <input type="text" required placeholder="Year of Publication" value={year} onChange={(e) => setYear(e.target.value)} />
                    </div>
                )}

                {citationType === 'Web' && (
                    <div className='inputs-citation'>
                        <input type="text" required placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                        <input type="text" required placeholder="Article Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input type="text" required placeholder="Website Title" value={websiteTitle} onChange={(e) => setWebsiteTitle(e.target.value)} />
                        <input type="text" required placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
                        <input type="text" required placeholder="Publication Date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} />
                    </div>
                )}

                <label htmlFor="citationFormat">Citation Format:</label>
                <select id="citationFormat" value={citationFormat} onChange={(e) => setCitationFormat(e.target.value)} required
                    style={{
                        width: '290px',
                        height: '32px',
                        marginTop: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '15px',
                        color: '#757575',
                        paddingLeft: '5px',
                    }}
                    onInvalid={e => e.target.setCustomValidity("You must pick an option.")}
                    onInput={e => e.target.setCustomValidity("")}
                >
                    <option value="">Select Format</option>
                    <option value="apa">APA</option>
                    <option value="mla">MLA</option>
                    <option value="chicago">Chicago</option>
                </select>

                <button type='submit' className="menu-submit-button" style={{ width: '145px' }} >Generate Citation</button>
            </form>

        </div>
    );
};

export default Citations;

