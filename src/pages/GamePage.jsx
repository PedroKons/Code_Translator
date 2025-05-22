import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getRandomPhrase, submitGuess, getUser, logout } from '../services/api'
import { LogOut } from 'lucide-react'

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
    const result = await submitGuess(token, phrase.id, userAnswer)
    setIsCorrect(result.isCorrect)
    setFeedback(result.feedback)

    if (isCorrect) {
      setPoints(points + 10)
    } else if (isCorrect === false) {
      setPoints(points - 5)
    }
  }

  const handleSkip = async (e) => {
    e.preventDefault()
    const data = await getRandomPhrase(token)
    setPhrase(data)
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
  }

  return phrase ? (
    <div className='w-[100%] h-[100vh] flex flex-col justify-center items-center bg-primary'>
      <h1 className='text-8xl font-bold font-["Bright"] mt-10'>Code Traslator</h1>
      <div className='flex flex-col justify-center items-center gap-4 h-full w-full'>
        <h1>{phrase.textEN}</h1>
        <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4'>
          <textarea 
            value={userAnswer} 
            onChange={(e) => setUserAnswer(e.target.value)} 
            placeholder="Tradução em português"
            className='w-[400px] h-[200px] border-2 border-gray-300 rounded-md p-2'
          />
          <div className='flex flex-row justify-center items-center gap-4'>
            <button type="submit" className='w-[200px] h-[40px] border-2 border-gray-300 rounded-md p-2'>Validar</button>
            <button onClick={handleSkip} className='w-[200px] h-[40px] border-2 border-gray-300 rounded-md p-2'>Pular</button>
          </div>
        </form>
        {feedback && <p>{feedback}</p>}
      </div>
      <div className='w-[100%] h-[100px] bg-gray-100 flex flex-row justify-center items-center bg-tertiary p-4'>
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
        <div className='flex justify-end items-center w-[100%]'>
            <span className='text-1xl font-bold'>Pontuação Total: <span className='text-2xl font-bold'>{points}</span></span>
        </div>
      </div>
    </div>
  ) : (
    <p>Carregando frase...</p>
  )
}
