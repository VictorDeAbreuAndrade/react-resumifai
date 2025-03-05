export default function Output({answerAI = 'Your summary will be displayed here'}) {

  let answerAiList = answerAI.split('- ')
  console.log(answerAiList)
  answerAiList[0] == '' ? answerAiList.shift() : null

  return (

    <div className="min-h-fit p-2 m-4 bg-neutral-900">
        <ul className="flex flex-col">
            {answerAiList.map((topic, index) => (
                ['Your summary will be displayed here',
                  'Generating summary...',
                  'Fetching transcription...'].includes(topic) ? <li key={index}>{topic.replaceAll('**', '')}</li>
                                                               : <li key={index}>• {topic.replaceAll('**', '')}</li>
            ))}

        </ul>
    </div>
  )
}
