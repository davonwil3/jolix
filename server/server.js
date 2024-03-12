const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const fs = require('fs');
const OpenAI = require('openai');
require('dotenv').config();
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"], 
    }
});
const cors = require('cors');
app.use(cors());
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const airoutes = require('./routes/airoutes');
app.use('/api', airoutes);


io.on('connection', (socket) => {
    console.log('A user connected');

    const tempAudioPath = './temp_audio';

    // Ensure the temp_audio directory exists
    if (!fs.existsSync(tempAudioPath)) {
        fs.mkdirSync(tempAudioPath, { recursive: true });
    }

    const tempFilePath = `${tempAudioPath}/audio_${socket.id}_${Date.now()}.webm`;
    const fileStream = fs.createWriteStream(tempFilePath);

    socket.on('audioData', (data) => {
        console.log('Receiving audio data...');
        fileStream.write(Buffer.from(new Uint8Array(data)));
    });

    socket.on('endAudioStream', async () => {
        console.log('End of audio stream. Processing audio...');
        fileStream.end();

        // Once the file is closed, start the transcription process
        fileStream.on('close', async () => {
            try {
                const transcription = await openai.audio.transcriptions.create({
                    file: fs.createReadStream(tempFilePath),
                    model: "whisper-1",
                });
                console.log('Transcription:', transcription.text);
                socket.emit('transcription', { transcription: transcription.text });
            } catch (error) {
                console.error('Transcription error:', error);
                socket.emit('transcription', { error: 'Failed to transcribe audio' });
            } finally {
                fs.unlink(tempFilePath, (err) => {
                    if (err) console.error('Error deleting temp file:', err);
                    else console.log('Temp file deleted successfully');
                });
            }
        });
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
