import { User, Star } from 'lucide-react'


export default function CandidateCard({ candidate }) {
  if(candidate.socketId===undefined){
    return null
  }

  return (
    
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {candidate.socketId}
              </dt>
              
            </dl>
          </div>
        </div>


        <div className="mt-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Tab Switches</div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-xl font-semibold text-gray-900">{candidate.tabSwitch}</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${candidate.tabSwitch}%` }}
            ></div>
          </div>
        </div>


        <div className="mt-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Focus Changes</div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-xl font-semibold text-gray-900">{candidate.focus}</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${candidate.focus}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Copy Events</div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-xl font-semibold text-gray-900">{candidate.copy}</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${candidate.copy}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Paste Events</div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-xl font-semibold text-gray-900">{candidate.paste}</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${candidate.paste}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Cut Events</div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-xl font-semibold text-gray-900">{candidate.cut}</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${candidate.cut}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Full Screen Exits</div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-xl font-semibold text-gray-900">{candidate.fullScreen}</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${candidate.fullScreen}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
    
  )
}

