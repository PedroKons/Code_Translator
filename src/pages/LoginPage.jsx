import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { loginUser } from '../services/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRegister = () => {
    navigate('/register')
  }

  const handleRank = () => {
    navigate('/ranking')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const result = await loginUser(email, password)
      if (result.token && result.userId) {
        login(result.token, result.userId)
        navigate('/game')
      } else {
        setError('Login falhou: Credenciais inválidas')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique se o servidor está rodando.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-[100%] h-[100vh] flex flex-col justify-center items-center p-4 bg-primary'>
      <h1 className='text-8xl font-bold font-["Bright"] mt-10'>Code Traslator</h1>
      <p>Treine seu inglês e conceitos de programação</p>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4 h-full w-full'>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <label className='text-2xl font-bold'>Login</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          disabled={isLoading}
          className='w-[20%] h-[40px] border-2 border-gray-300 rounded-md p-2'
          required
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Senha" 
          disabled={isLoading}
          className='w-[20%] h-[40px] border-2 border-gray-300 rounded-md p-2'
          required
        />
        <div className='flex flex-row gap-4 justify-center items-center w-[20%]'>
          <button type="submit" disabled={isLoading} className='button-19'>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          <button onClick={handleRegister} className='button-19'>
            Cadastrar
          </button>
        </div>
      </form>
      <div className='flex flex-row justify-center items-center gap-2'>
        <button onClick={handleRank} className='button-19'>Ranking</button>
      </div>
    </div>
  )
}
