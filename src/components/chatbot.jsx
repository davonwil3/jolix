import React, { useState } from 'react';
import Messages from './messages';
import axios from 'axios';

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    async function sendMessage() {
        try {
            const response = await axios.post('/api/chatbot', {
                message: input,
                username: 'davonwil3',
            }, {
                withCredentials: true
            });
            const data = response.data;
            setMessages(prevMessages => [...prevMessages, { role: 'user', content: input }, data]);
            setInput('');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='chatbot-container'>
            <h1>Jolix assistant</h1>
            <div className='chatbox'>
                {messages.map((message, index) => (
                    <Messages key={index} role={message.role} content={message.content} />
                ))}
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chatbot;