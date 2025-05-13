import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import CandidateCard from "./CandidateCard";
import io from "socket.io-client";
import { User, Star } from 'lucide-react'


const socket = io("http://localhost:8000");

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected with socket ID:", socket.id);
      socket.emit("frontend", { socketId: socket.id });
    });

    const updateCandidate = (data, key) => {
      const { socketId, count } = data;
      console.log(key)
      setCandidates((prevCandidates) => {
        const updatedCandidates = prevCandidates.map((candidate) => {
          if (candidate.socketId === socketId) {
            return {
              ...candidate,
              [key]: count,  
            };
          }
          return candidate;
        });
        
        if (!updatedCandidates.some(candidate => candidate.socketId === socketId)) {
          updatedCandidates.push({ socketId, [key]: count });
        }
    
        return updatedCandidates;
      }); console.log(candidates);
    };
  
    socket.on("fullscreenChanged", (data) =>
      updateCandidate(data, "fullScreen")
    );
    socket.on("visibilitychange", (data) => updateCandidate(data, "tabSwitch"));
    socket.on("windowFocusChanged", (data) => updateCandidate(data, "focus"));
    socket.on("copyEvent", (data) => updateCandidate(data, "copy"));
    socket.on("pasteEvent", (data) => updateCandidate(data, "paste"));
    socket.on("cutEvent", (data) => updateCandidate(data, "cut"));

  }, []);

  

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Candidate Dashboard
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidates..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
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
                      <div className="text-sm font-medium text-gray-500">
                        Tab Switches
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-xl font-semibold text-gray-900">
                          {candidate.focus}
                        </span>
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
                      <div className="text-sm font-medium text-gray-500">
                        Focus Changes
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-xl font-semibold text-gray-900">
                          {candidate.focus}
                        </span>
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
                      <div className="text-sm font-medium text-gray-500">
                        Copy Events
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-xl font-semibold text-gray-900">
                          {candidate.copy}
                        </span>
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
                      <div className="text-sm font-medium text-gray-500">
                        Paste Events
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-xl font-semibold text-gray-900">
                          {candidate.paste}
                        </span>
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
                      <div className="text-sm font-medium text-gray-500">
                        Cut Events
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-xl font-semibold text-gray-900">
                          {candidate.cut}
                        </span>
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
                      <div className="text-sm font-medium text-gray-500">
                        Full Screen Exits
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-xl font-semibold text-gray-900">
                          {candidate.fullScreen}
                        </span>
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
