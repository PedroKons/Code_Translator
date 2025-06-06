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
  const [showUserPopup, setShowUserPopup] = useState(false)
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
      <h1 className='text-4xl sm:text-8xl font-bold font-["Bright"] mt-10 text-center'>Code Traslator</h1>
      <p className='text-center'>Treine seu inglês e conceitos de programação</p>
      <div className='flex flex-col justify-center items-center h-full w-full sm:w-[500px] gap-5 px-4 sm:px-0'>
        <div className='flex justify-center items-center w-[100%] text-center flex-col gap-4'>
          <h1 className='font-bold text-lg sm:text-base'>{phrase.textEN}</h1>
          <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4 w-full'>
            <textarea 
              value={userAnswer} 
              onChange={(e) => setUserAnswer(e.target.value)} 
              placeholder="Tradução em português"
              className={`w-full sm:w-[500px] h-[200px] sm:h-[300px] rounded-md p-2 min-h-[200px] sm:min-h-[300px] ${textareaStyle}`}
            />
            <div className='flex flex-row justify-center items-center gap-4 w-full sm:w-auto'>
              <button type="submit" className='button-19 w-full sm:w-auto' disabled={isLoading}>Validate</button>
              <button onClick={handleSkip} className='button-19 w-full sm:w-auto' disabled={isLoading}>Skip</button>
            </div>
          </form>
        </div>
        <div className='flex flex-col justify-center items-center w-[100%] text-justify gap-4'>
          <label className='font-bold'>Resposta da Validação</label>

          {isLoading && <span className="loader"></span>}

          {hasSubmitted && !isLoading && (
            <div className='border-gray-300 border-2 p-2 rounded-md w-full'>
              {feedback && <p className='text-sm sm:text-base'>{feedback}</p>}
            </div>
          )}
        </div>
      </div>
      <div className='w-[100%] h-[100px] flex flex-row justify-between items-center bg-tertiary p-4 relative'>
        {/* Left side - User info */}
        <div className='flex items-center gap-4'>
          <div 
            className='w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] bg-gray-300 rounded-full flex justify-center items-center border-2 border-black text-xl sm:text-2xl font-bold cursor-pointer hover:bg-gray-200 transition-colors sm:cursor-default'
            onClick={() => setShowUserPopup(!showUserPopup)}
          >
            {primaryChar}
          </div>
          <div className='hidden sm:flex flex-col justify-center items-start'>
            <h1 className='text-base sm:text-1xl font-bold'>{name}</h1>
            <p className='text-xs'>{email}</p>
          </div>
          <div className='hidden sm:flex flex-col justify-center items-end'>
            <LogOut size={20} onClick={handleLogout} className='cursor-pointer'/>
          </div>
        </div>

        {/* Right side - Ranking and Points */}
        <div className='flex items-center gap-12'>
          <span className='text-sm sm:text-1xl font-bold'>Pontuação Total: <span className='text-lg sm:text-2xl font-bold'>{points}</span></span>
          <button onClick={handleRank} className='text-sm sm:text-1xl font-bold bg-black text-white rounded-md p-1 sm:p-2 w-[80px] sm:w-[100px] hover:bg-gray-800'>Ranking</button>
        </div>

        {/* User Popup - Only visible on mobile */}
        {showUserPopup && (
          <div className='absolute bottom-[110px] left-4 bg-white rounded-lg shadow-lg p-4 w-[250px] border border-gray-200 sm:hidden z-50'>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-3'>
                <div className='w-[40px] h-[40px] bg-gray-300 rounded-full flex justify-center items-center border-2 border-black text-xl font-bold'>
                  {primaryChar}
                </div>
                <div className='flex flex-col'>
                  <h2 className='font-bold text-lg'>{name}</h2>
                  <p className='text-sm text-gray-600'>{email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className='flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm'
              >
                <LogOut size={16} />
                Sair da conta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className='w-full h-screen flex items-center justify-center'>
      <p>Carregando frase...</p>
    </div>
  )
}
