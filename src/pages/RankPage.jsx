import {Trophy} from "lucide-react"
import UserRank from "../components/UserRank"
import { useEffect, useState } from "react"
import rankingPhrases from "../utils/rankingPhrases.json"
import { useNavigate } from "react-router-dom"

export default function RankPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("https://api.pktech.fun/leaderboard")
        const data = await response.json()
        setUsers(data)
        setSuccess(true)
      } catch (error) {
        console.log(error)
        setSuccess(false)
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className='w-[100%] min-h-[100vh] flex flex-col justify-center items-center bg-primary'>
      <div className="flex flex-row justify-start items-center gap-2">
        <button onClick={() => navigate('/game')} className="button-19">Jogar</button>
      </div>
      <h1 className='text-8xl font-bold font-["Bright"] mt-10'>Code Traslator</h1>
      <p>Treine seu inglês e conceitos de programação</p>
      <div className='flex flex-col justify-start items-center h-full w-[100%] mt-16 gap-6'>
        <h2 className='text-3xl font-bold font-["Bright"]'>Ranking of the best</h2>
        <div className="border-tertiary border-2 p-2 rounded-md w-[80%]">
            <div className="w-full flex items-center justify-start gap-2 p-2">
                <Trophy />
                <p className="text-2xl font-bold">Classificação Geral</p>
            </div>
            <div className="flex flex-col gap-2">
                {success && users.data.map((user, index) => (
                    <UserRank 
                      key={user.id} 
                      user={user} 
                      phrase={rankingPhrases[index]?.text || ""}
                      index={index}
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
