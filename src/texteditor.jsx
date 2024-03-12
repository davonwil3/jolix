import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TextEditor.css'; // Ensure CSS file exists
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import AiPrompt from './components/aiprompt';
import { faKeyboard } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { faMicrophone } from '@fortawesome/pro-regular-svg-icons';
import io from 'socket.io-client';


function TextEditor() {
    const [value, setValue] = useState('');
    const quillRef = useRef(null); // Ref to attach Quill instance
    const [prompt, setPrompt] = useState('');
    const [menuExpanded, setMenuExpanded] = useState(false);
    const [sidebarContent, setSidebarContent] = useState('');
    const editorStyles = {
        height: '125vh',
        width: '916px',
        backgroundColor: 'white',
        border: 'unset',
        borderRadius: '10px',
        marginTop: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',

    };

    useEffect(() => {
        // Register custom fonts and sizes
        const Font = ReactQuill.Quill.import('formats/font');
        Font.whitelist = ['sans-serif', 'serif', 'monospace', 'georgia', 'comic-sans', 'arial', 'lucida', 'times-new-roman', 'courier-new', 'verdana'];
        ReactQuill.Quill.register(Font, true);

        const Size = ReactQuill.Quill.import('attributors/style/size');
        Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'];
        ReactQuill.Quill.register(Size, true);
    }, []);

    const modules = {
        toolbar: {
            container: "#toolbar",
        },
        history: {
            delay: 1000,
            maxStack: 50,
            userOnly: true
        }

    };
    const undo = () => {
        const quill = quillRef.current.getEditor();
        quill.history.undo();
    };

    const redo = () => {
        const quill = quillRef.current.getEditor();
        quill.history.redo();
    };
    const expandMenu = (content) => {
        setMenuExpanded(!menuExpanded);
        setSidebarContent(content);

    }


    const generateFromAI = async (promptai, size) => {
        // Use the prompt state for the request
        try {
            console.log(promptai);
            console.log(process.env.REACT_APP_BACKEND_URL);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/generate-text`, {
                prompt: promptai,
                size: size
            });

            if (response.data && response.data.result) {
                const editor = quillRef.current.getEditor();
                // Append the generated text to the end of the current content
                const currentContent = editor.getContents();
                const delta = editor.clipboard.convert(response.data.result);
                editor.setContents(currentContent); // Reset to current content to maintain undo stack
                editor.updateContents(delta, 'user'); // Append new content

            }
        } catch (error) {
            console.error('Error generating text:', error);
        }
    };

    let mediaRecorder;
    let ws;
    let isListening = false;
    let socket;

    function toggleListening() {
        isListening = !isListening;

        const indicator = document.getElementById('listeningIndicator');
        const audio = document.getElementById('buttonAudio');

        if (isListening) {
            startListening();
            audio.play();
            indicator.classList.remove('hidden');
        } else {
            stopListening();
            indicator.classList.add('hidden');
        }
    }
 // Example using Socket.IO in a client-side application


function startListening() {
    console.log('Start listening...');
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Connect to Socket.IO server
            socket = io('http://localhost:3001');

            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function(event) {
                if (event.data.size > 0) {
                    socket.emit('audioData', event.data);
                }
            };

            mediaRecorder.start(1000); // Split the audio into chunks of 1 second

            // Handle transcription result
            socket.on('transcription', (data) => {
                console.log('Transcription:', data.transcription);
                // Handle displaying transcription in the UI here
            });

        }).catch(console.error);
}

function stopListening() {
    console.log('Stop listening...');
    if (mediaRecorder) {
        mediaRecorder.stop();
        // Send a message to the server indicating the end of the stream
        socket.emit('endAudioStream', {});
    }
}


    return (
        <div className='editor-page'>
            <div id="toolbar">
                <span className="ql-formats">
                    <button className="ql-undo" title="Undo" onClick={undo}><FontAwesomeIcon icon={faUndo} /></button>
                    <button className="ql-redo" title="Redo" onClick={redo}><FontAwesomeIcon icon={faRedo} /></button>
                    <span className="ql-formats" title="Font Type">
                        <select className="ql-font">
                            <option value="sans-serif">Sans Serif</option>
                            <option value="serif">Serif</option>
                            <option value="monospace">Monospace</option>
                            <option value="georgia">Georgia</option>
                            <option value="comic-sans">Comic Sans</option>
                            <option value="arial">Arial</option>
                            <option value="lucida">Lucida</option>
                            <option value="times-new-roman">Times New Roman</option>
                            <option value="courier-new">Courier New</option>
                            <option value="verdana">Verdana</option>
                        </select>
                    </span>
                </span>
                <span className="ql-formats" title="Font Size">
                    <select className="ql-size" defaultValue="16px">
                        <option value="10px">10px</option>
                        <option value="12px">12px</option>
                        <option value="14px">14px</option>
                        <option value="16px">16px</option>
                        <option value="18px">18px</option>
                        <option value="20px">20px</option>
                        <option value="24px">24px</option>
                        <option value="30px">30px</option>
                        <option value="36px">36px</option>
                    </select>
                </span>
                <span className="ql-formats">
                    <select className="ql-header" title="Header Size">
                        <option value="" selected>Normal</option>
                        <option value="1">Heading 1</option>
                        <option value="2">Heading 2</option>
                        <option value="3">Heading 3</option>
                    </select>
                    <button className="ql-bold" title="Bold"></button>
                    <button className="ql-italic" title="Italic"></button>
                    <button className="ql-underline" title="Underline"></button>
                    <select className="ql-color" title="Text Color"></select>
                    <select className="ql-background" title="Background Color"></select>
                    <button className="ql-list" value="ordered" title="Ordered List"></button>
                    <button className="ql-list" value="bullet" title="Bullet List"></button>
                    <select className="ql-align" title="Text Alignment">
                        <option value="" selected>Align Left</option>
                        <option value="center">Align Center</option>
                        <option value="right">Align Right</option>
                        <option value="justify">Justify</option>
                    </select>
                    <button className="ql-link" title="Insert Link"></button>
                    <button className="ql-image" title="Insert Image"></button>
                    <button className="ql-video" title="Insert Video"></button>
                    <button className="ql-clean" title="Clear Formatting"></button>
                </span>
            </div>
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <div className={`menu ${menuExpanded ? 'menu-expanded' : ''}`}>
                    <div className='icons-wrapper'>
                        <FontAwesomeIcon icon={faKeyboard} className='menu-icons' title="Generate AI Text" onClick={() => expandMenu("aiprompt")} />
                        <FontAwesomeIcon icon={faMicrophone} className='menu-icons' title="Dictation" onClick={toggleListening} />
                    </div>
                    {sidebarContent === 'aiprompt' && menuExpanded && <AiPrompt func={generateFromAI} />}


                </div>
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    style={editorStyles}
                    modules={modules}
                />
                <div id="listeningIndicator" class="listening-indicator hidden" onClick={toggleListening}>
                    <FontAwesomeIcon icon={faMicrophone} className='audio-icon' />
                    <audio id='buttonAudio' src="/assets/bell.wav" preload='auto' style={{}}></audio>
                </div>
            </div>

        </div>
    );
}

export default TextEditor;
