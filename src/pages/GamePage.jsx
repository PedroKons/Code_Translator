import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getRandomPhrase, submitGuess, getUser, logout } from '../services/api'
import { LogOut } from 'lucide-react'
import "./styles/geral.css"
import { useNavigate } from 'react-router-dom'

export default function GamePage() {
  const { token } = useAuth()
  const [phrase, setPhrase] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [user, setUser] = useState(null)
  const [points, setPoints] = useState(0)
  const [primaryChar, setPrimaryChar] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [textareaStyle, setTextareaStyle] = useState('border-2 border-gray-300')
  const navigate = useNavigate()

  const playAudio = (isCorrect) => {
    const audio = new Audio(isCorrect ? '/sounds/correct.wav' : '/sounds/incorrect.wav')
    audio.play()
  }

  useEffect(() => {
    async function loadPhrase() {
      const data = await getRandomPhrase(token)
      setPhrase(data)
    }
    loadPhrase()
  }, [token])

  useEffect(() => {
    async function loadUser() {
      const data = await getUser(token)
      setUser(data)
      setPoints(data.points)
      setPrimaryChar(data.name[0].toUpperCase())
      setName(data.name)
      setEmail(data.email)
    }
    loadUser()
  }, [token])

const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  setHasSubmitted(false)

  const result = await submitGuess(token, phrase.id, userAnswer)
  setIsCorrect(result.isCorrect)
  setFeedback(result.feedback)
  setIsLoading(false)
  setHasSubmitted(true)

  // Play audio and set textarea style based on result
  playAudio(result.isCorrect)
  setTextareaStyle(result.isCorrect ? 'border-2 border-green-500' : 'border-2 border-red-500')

  if (result.isCorrect) {
    setPoints(points + 10)
  } else {
    setPoints(points - 5)
  }
}

  const handleSkip = async (e) => {
    e.preventDefault()
    const data = await getRandomPhrase(token)
    setPhrase(data)
    setHasSubmitted(false)
    setFeedback('')
    setUserAnswer('')
    setTextareaStyle('border-2 border-gray-300')
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
  }

  const handleRank = () => {
    navigate('/ranking', { replace: true })
  }

  return phrase ? (
    <div className='w-[100%] h-[100vh] flex flex-col justify-center items-center bg-primary'>
      <h1 className='text-8xl font-bold font-["Bright"] mt-10'>Code Traslator</h1>
      <p>Treine seu inglês e conceitos de programação</p>
      <div className='flex flex-col justify-center items-center h-full w-[500px] gap-5'>
        <div className='flex justify-center items-center w-[100%] text-center flex-col gap-4'>
          <h1 className='font-bold'>{phrase.textEN}</h1>
          <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4'>
            <textarea 
              value={userAnswer} 
              onChange={(e) => setUserAnswer(e.target.value)} 
              placeholder="Tradução em português"
              className={`w-[500px] h-[300px] rounded-md p-2 min-h-[300px] ${textareaStyle}`}
            />
            <div className='flex flex-row justify-center items-center gap-4'>
              <button type="submit" className='button-19' disabled={isLoading}>Validate</button>
              <button onClick={handleSkip} className='button-19' disabled={isLoading}>Next</button>
            </div>
          </form>
        </div>
        <div className='flex flex-col justify-center items-center w-[100%] text-justify gap-4'>
          <label className='font-bold'>Resposta da Validação</label>

          {isLoading && <span className="loader"></span>}

          {hasSubmitted && !isLoading && (
            <div className='border-gray-300 border-2 p-2 rounded-md'>
              {feedback && <p>{feedback}</p>}
            </div>
          )}
        </div>
      </div>
      <div className='w-[100%] h-[100px] flex flex-row justify-center items-center bg-tertiary p-4'>
        <div className='flex justify-start items-center w-[100%] gap-4'>
          <div className='w-[60px] h-[60px] bg-gray-300 rounded-full flex justify-center items-center border-2 border-black text-2xl font-bold'>{primaryChar}</div>
          <div className='flex flex-col justify-center items-start'>
            <h1 className='text-1xl font-bold'>{name}</h1>
            <p className='text-xs'>{email}</p>
          </div>
          <div className='flex flex-col justify-center items-end'>
            <LogOut size={20} onClick={handleLogout}/>
          </div>
        </div>
        <div className='flex justify-end items-center w-[100%] gap-4'>
          <div className='flex flex-row justify-center items-center gap-2'>
            <button onClick={handleRank} className='text-1xl font-bold bg-black text-white rounded-md p-2 w-[100px] hover:bg-gray-800'>Ranking</button>
          </div>
          <span className='text-1xl font-bold'>Pontuação Total: <span className='text-2xl font-bold'>{points}</span></span>
        </div>
      </div>
    </div>
  ) : (
    <p>Carregando frase...</p>
  )
}
