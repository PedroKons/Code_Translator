import {Trophy, Award, Medal} from "lucide-react"

export default function UserRank({user, phrase, index}) {
  return (
    <div className="flex items-center justify-between p-2 bg-white border-2 border-black rounded-md">
        <div className="flex items-center justify-center gap-4">
            <div>
                {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                {index === 2 && <Award className="h-6 w-6 text-amber-600" />}
                {index > 2 && <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>}
            </div>
            <div className="flex items-center justify-center gap-2">
                <div className="w-[50px] h-[50px] bg-gray-300 rounded-full flex justify-center items-center border-2 border-black text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</div>
                <div>
                    <p>{user.name}</p>
                    <span className="text-sm text-gray-600">{phrase}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center justify-center">
            <Award />
            <span>{user.points} pts</span>
        </div>
    </div>
  )
}
