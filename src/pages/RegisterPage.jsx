import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { registerUser } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (password !== confirmPassword) {
            setError('As senhas não coincidem')
            setIsLoading(false)
            return
        }
        
        try {
            const result = await registerUser(email, password, name)
            if (result.token && result.userId) {
                register(result.token, result.userId)
                navigate('/game')
            } else {
                setError('Erro ao registrar usuário')
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor. Verifique se o servidor está rodando.')
            console.error('Erro ao registrar usuário:', err)
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
            <label className='text-2xl font-bold'>Registrar</label>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Nome" 
                disabled={isLoading}
                className='w-[20%] h-[40px] border-2 border-gray-300 rounded-md p-2'
                required
            />
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
            <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirmar Senha" 
                disabled={isLoading}
                className='w-[20%] h-[40px] border-2 border-gray-300 rounded-md p-2'
                required
            />
            <div className='flex flex-row gap-4 justify-center items-center w-[20%]'>
                <button type="submit" disabled={isLoading} className='button-19'>
                {isLoading ? 'Registrando...' : 'Registrar'}
                </button>
                <button onClick={() => navigate('/')} className='button-19'>
                    Entrar
                </button>
            </div>
            </form>
        </div>
    )
}
