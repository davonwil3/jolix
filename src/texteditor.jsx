import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React, { useState, useRef, useEffect } from 'react';
import './TextEditor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import AiPrompt from './components/aiprompt';
import { faKeyboard } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { faMicrophone } from '@fortawesome/pro-regular-svg-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { faPenToSquare } from '@fortawesome/pro-regular-svg-icons';
import Rephraseai from './components/rephraseai';
import registerQuillSpellChecker from 'react-quill-spell-checker';
import { faBook } from '@fortawesome/pro-regular-svg-icons';
import Modal from 'react-modal';
import Summarizer from './summarizer';
import { faQuoteLeft } from '@fortawesome/pro-regular-svg-icons';
import Citations from './components/citations';




function TextEditor() {
    const [value, setValue] = useState('');
    const quillRef = useRef(null);
    const [menuExpanded, setMenuExpanded] = useState(false);
    const [sidebarContent, setSidebarContent] = useState('');
    const [isSpellCheckMode, setIsSpellCheckMode] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    registerQuillSpellChecker(Quill)
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
        Font.whitelist = [
            'sans-serif',
            'serif',
            'monospace',
            'georgia',
            'comic-sans',
            'arial',
            'lucida',
            'times-new-roman',
            'courier-new',
            'verdana',
        ];
        ReactQuill.Quill.register(Font, true);

        const Size = ReactQuill.Quill.import('attributors/style/size');
        Size.whitelist = [
            '10px',
            '12px',
            '14px',
            '16px',
            '18px',
            '20px',
            '24px',
            '30px',
            '36px',
        ];
        ReactQuill.Quill.register(Size, true);
    }, []);

  

    const modules = {
        toolbar: {
            container: '#toolbar',
        },
        history: {
            delay: 1000,
            maxStack: 50,
            userOnly: true,
        },
        spellChecker: {
            allowIncomplete: true,
            allowCompound: true,
            language: 'en',
            autoCheck: true,
        },

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
    };

    const generateFromAI = async (promptai, size) => {
        try {
            console.log(promptai);
            console.log(process.env.REACT_APP_BACKEND_URL);
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/generate-text`,
                {
                    prompt: promptai,
                    size: size,
                }
            );

            if (response.data && response.data.result) {
                const editor = quillRef.current.getEditor();
                const currentContent = editor.getContents();
                const delta = editor.clipboard.convert(response.data.result);
                delta.ops.forEach(op => {
                    if (op.insert && typeof op.insert === 'string') {
                        op.attributes = { background: 'yellow' };
                    }
                });
                editor.setContents(currentContent);
                editor.updateContents(delta, 'user');
                setTimeout(() => {
                    const content = editor.getContents();
                    content.ops.forEach(op => {
                        if (op.attributes && op.attributes.background === 'yellow') {
                            delete op.attributes.background;
                        }
                    });
                    editor.setContents(content);
                }, 3000);
            }
        } catch (error) {
            console.error('Error generating text:', error);
        }
    };


    const {
        transcript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();
    const lastTranscriptLength = useRef(0);

    const handleStartListening = () => {
        SpeechRecognition.startListening({ continuous: true });
    };

    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        setEditorContent(editorContent + transcript.slice(lastTranscriptLength.current));
        lastTranscriptLength.current = transcript.length;
    }, [transcript]);

    useEffect(() => {
        const quillEditor = quillRef.current.getEditor();
        quillEditor.setText(editorContent);
    }, [editorContent]);

    if (!browserSupportsSpeechRecognition) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    const toggleListening = () => {
        const listeningIndicator = document.getElementById('listeningIndicator');
        const audio = document.getElementById('buttonAudio');
        if (listeningIndicator.classList.contains('hidden')) {
            listeningIndicator.classList.remove('hidden');
            audio.play();
            handleStartListening();
        } else {
            listeningIndicator.classList.add('hidden');
            SpeechRecognition.stopListening();
        }
    };

    const rephraseFromAI = async (tone) => {
        try {
            console.log('rephrasing text');
            const quillEditor = quillRef.current.getEditor();
            quillEditor.focus();
            const range = quillEditor.getSelection();


            let selectedText = quillEditor.getText(range.index, range.length);
            selectedText = selectedText.split(' ').slice(0, 350).join(' ');

            if (selectedText.length === 0) {
                alert('Please select some text to rephrase.');
                return;
            }

            if (tone === '') {
                tone = 'neutral';
            }

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/rephrase-text`,
                {
                    prompt: `Reword the following text with a ${tone} tone:  ${selectedText}`,
                }
            );

            if (response.data && response.data.result) {
                const rephrasedText = response.data.result;
                quillEditor.deleteText(range.index, range.length);
                quillEditor.insertText(range.index, rephrasedText);
                quillEditor.formatText(range.index, rephrasedText.length, 'background', 'yellow')
                setTimeout(() => {
                    quillEditor.formatText(range.index, rephrasedText.length, 'background', false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error rephrasing text:', error);
        }
    };

    return (
        <div className='editor-page'>
            <div id='toolbar'>
                <span className='ql-formats'>
                    <button className='ql-undo' title='Undo' onClick={undo}>
                        <FontAwesomeIcon icon={faUndo} />
                    </button>
                    <button className='ql-redo' title='Redo' onClick={redo}>
                        <FontAwesomeIcon icon={faRedo} />
                    </button>
                    <span className='ql-formats' title='Font Type'>
                        <select className='ql-font'>
                            <option value='sans-serif'>Sans Serif</option>
                            <option value='serif'>Serif</option>
                            <option value='monospace'>Monospace</option>
                            <option value='georgia'>Georgia</option>
                            <option value='comic-sans'>Comic Sans</option>
                            <option value='arial'>Arial</option>
                            <option value='lucida'>Lucida</option>
                            <option value='times-new-roman'>Times New Roman</option>
                            <option value='courier-new'>Courier New</option>
                            <option value='verdana'>Verdana</option>
                        </select>
                    </span>
                </span>
                <span className='ql-formats' title='Font Size'>
                    <select className='ql-size' defaultValue='16px'>
                        <option value='10px'>10px</option>
                        <option value='12px'>12px</option>
                        <option value='14px'>14px</option>
                        <option value='16px'>16px</option>
                        <option value='18px'>18px</option>
                        <option value='20px'>20px</option>
                        <option value='24px'>24px</option>
                        <option value='30px'>30px</option>
                        <option value='36px'>36px</option>
                    </select>
                </span>
                <span className='ql-formats'>
                    <select className='ql-header' title='Header Size'>
                        <option value='' selected>
                            Normal
                        </option>
                        <option value='1'>Heading 1</option>
                        <option value='2'>Heading 2</option>
                        <option value='3'>Heading 3</option>
                    </select>
                    <button className='ql-bold' title='Bold'></button>
                    <button className='ql-italic' title='Italic'></button>
                    <button className='ql-underline' title='Underline'></button>
                    <select className='ql-color' title='Text Color'></select>
                    <select className='ql-background' title='Background Color'></select>
                    <button className='ql-list' value='ordered' title='Ordered List'></button>
                    <button className='ql-list' value='bullet' title='Bullet List'></button>
                    <select className='ql-align' title='Text Alignment'>
                        <option value='' selected>
                            Align Left
                        </option>
                        <option value='center'>Align Center</option>
                        <option value='right'>Align Right</option>
                        <option value='justify'>Justify</option>
                    </select>
                    <button className='ql-link' title='Insert Link'></button>
                    <button className='ql-image' title='Insert Image'></button>
                    <button className='ql-video' title='Insert Video'></button>
                    <button className='ql-clean' title='Clear Formatting'></button>
                </span>
            </div>
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div className={`menu ${menuExpanded ? 'menu-expanded' : ''}`}>
                    <div className='icons-wrapper'>
                        <FontAwesomeIcon
                            icon={faKeyboard}
                            className='menu-icons'
                            title='Generate AI Text'
                            onClick={() => expandMenu('aiprompt')}
                        />
                        <FontAwesomeIcon
                            icon={faMicrophone}
                            className='menu-icons'
                            title='Dictation'
                            onClick={toggleListening}
                        />
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            className='menu-icons'
                            title='Rephraser'
                            onClick={() => expandMenu('rephrase')}
                        />
                        <FontAwesomeIcon
                            icon={faBook}
                            className='menu-icons'
                            title='Summarize'
                            onClick={() => setModalIsOpen(true)}
                        />
                        <FontAwesomeIcon 
                            icon={faQuoteLeft} 
                            className='menu-icons'
                            title='Citation Generator'
                            onClick={() => expandMenu('citation')}
                        />
                        

                    </div>
                    {sidebarContent === 'aiprompt' && menuExpanded && <AiPrompt func={generateFromAI} />}
                    {sidebarContent === 'rephrase' && menuExpanded && <Rephraseai func={rephraseFromAI} />}
                    {sidebarContent === 'citation' && menuExpanded && <Citations />}
                </div>

                <ReactQuill
                    ref={quillRef}
                    theme='snow'
                    value={value}
                    onChange={setValue}
                    style={editorStyles}
                    modules={modules}
                    readOnly={isSpellCheckMode}
                    
                />

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    style={{
                        content: {
                            width: '60%',
                            height: '90%',
                            margin: 'auto',
                            border: 'unset',
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflowY: 'auto',
                        },
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // This will give a black background with 50% opacity
                        },
                    }}
                >
                    <Summarizer />
                </Modal>
                                
                <div id='listeningIndicator' className='listening-indicator hidden' onClick={toggleListening}>
                    <FontAwesomeIcon icon={faMicrophone} className='audio-icon' />
                    <audio id='buttonAudio' src='/assets/bell.wav' preload='auto' style={{}}></audio>
                </div>

            </div>
        </div>
    );
}

export default TextEditor;
