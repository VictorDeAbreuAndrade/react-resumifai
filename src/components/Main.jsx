/* eslint-disable no-mixed-spaces-and-tabs */
import axios from 'axios'
import { useState } from 'react'
import Output from './Output'

export function Main() {

	const backEndUrl = import.meta.env.VITE_SERVER_URL
	const [idDetected, setIdDetected] = useState('')
	const [summary, setSummary] = useState('Your summary will be displayed here')

	function handleChange (event) {
		let videoId = urlValidate(event.target.value)
		setIdDetected(videoId)
  	}

	async function handleButtonResumirClicked () {

		try {

			setSummary('Fetching transcription...')
			const transcriptionResponse = await axios.get(`${backEndUrl}/transcription/${idDetected}`)

			setSummary('Generating summary...')
			const summaryResponse = await axios.post(`${backEndUrl}/summary/${idDetected}`,
				{
					transcription: transcriptionResponse.data.transcription
				})

			setSummary(summaryResponse.data.summary)

		} catch (error) {
			setSummary(console.error(error))
		}

	}

	function handleButtonLimparClicked () {
		window.location.reload()
	}

	return (
		<>
			<div className="p-2 text-center space-x-4 m-2">

				<div className='flex items-center space-x-3'>

					<input type="url" name="urlVideo" id="urlVideo" placeholder='Paste here the video URL' className="align-middle text-black p-2 w-2/3 h-10 border shadow-md" onChange={handleChange}/>
					<button className="p-2 w-1/6 shadow-md bg-gray-600 hover:bg-gray-700" onClick={handleButtonResumirClicked}>ResumifAI</button>
					<button className="p-2 w-1/6 shadow-md bg-gray-500 hover:bg-gray-700" onClick={handleButtonLimparClicked}>Reset</button>

				</div>

				<div className="space-x-4 mt-3 text-sm text-center">
					<input type="radio" name="qtdWords" id="qt200" value="200words" defaultChecked /> 200 words
					<input type="radio" name="qtdWords" id="qt300" value="300words" /> 300 words
					<input type="radio" name="qtdWords" id="qtdNo" value="noLimits" /> No limit of words
					<span className="space-x-2">
						<input type="radio" name="qtdWords" id="qtdPersonalized" value="personalized" /> Other quantity (50-9999):
						<input className="h-8 p-1 w-14 border shadow-md text-black" type="number" name="qtdChosen" id="qtdChosen" min="50" max="9999" />
					</span>
				</div>

			</div>
		<Output answerAI={summary} />
		{idDetected == 'Invalid ID!' ? (<div className='absolute top-1 left-1 border border-red-600 p-1 text-sm font-semibold text-red-600 bg-red-300'>Insert a valid URL!</div>) : ''}
    </>
  )
}

function urlValidate(url) {

	let idDetected = 'Invalid ID!'

	// Check if URL is from Youtube and collect its ID
	if (url.includes('https://www.youtube.com/watch?v=')) {
		idDetected = url.split(/watch\?v=|&/)[1]
		idDetected.length == 11 ? null : idDetected = 'Invalid ID!'
	} else if (url.includes('https://youtu.be/')) {
		idDetected = url.split(/youtu.be\/|\?/)[1]
		idDetected.length == 11 ? null : idDetected = 'Invalid ID!'
	} else if (url == '') {	//Colocar aqui o possibilidade de dectectar links de lives
		idDetected = ''
	} else if (url == '') {
		idDetected = ''
	}

	console.log(`Video ID: ${idDetected}`)

	return idDetected
}
