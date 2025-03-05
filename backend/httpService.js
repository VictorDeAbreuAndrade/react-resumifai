import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeTranscript } from 'youtube-transcript';

dotenv.config({path: './backend/.env'})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const port = process.env.PORT
const originFrontEnd = process.env.FRONT_END_URL

const app = express()
app.use(cors({ origin: originFrontEnd }))
app.use(express.json())

app.get('/transcription/:id', async (req, res) => {

    const videoId = req.params.id

    if (!videoId) {
        return res.status(400).json({ error: 'You must inform a video ID.' })
    }

    try {

        /* Former way to obtain the transcription
        const response = await axios.get(`https://youtubetranscript.com/?server_vid2=${videoId}`);
        const grossText = response.data
        const filteredText = grossText.replace(/<[a-z/?="-.0-9\s^]+>/g, ' ').replace(/\s\s+/g, ' ')
        */

        const response = await YoutubeTranscript.fetchTranscript(videoId)

        let transcript = new String
        for (let i = 0; i < response.length; i++) {
            transcript += response[i].text
        }

        // console.log(transcript)

        res.status(200).json({transcription: transcript})

    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).json({ error: 'Error trying to extract the video transcription from a YouTube video.' });
    }

})

app.post('/summary/:id', async (req, res) => {

    const transcription = req.body.transcription

    if(!transcription) {
        return res.status(400).json({ error: 'Transcription not found!' })
    }

    try {

        // const prompt = `Sumarize o texto abaixo em tópicos em que cada tópico deve ser iniciado pelo caractere "-". Mantenha as informações principais do vídeo e respeite o limite de 200 palavras. Eis o texto:\n\n${transcription}`
        const prompt = `Summarize the text below in topics and each topic have to initiate with the character "-". Keep the important information and respect the limit of 200 words. Finally, keep the summary in the same language as the text. That's the text:\n\n${transcription}`
        const result = await model.generateContent(prompt)
        const response = result.response.candidates[0].content.parts[0].text

        console.log('Summary generated successfully!')
        res.status(200).json({summary: response})

    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).json({ error: 'Error trying to summarizing the video. Problems with Gemini.' });
    }
})

app.listen(port, () => console.log(`Backend is running on port ${port}`))
