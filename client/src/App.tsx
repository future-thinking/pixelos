import { useEffect, useState } from 'react'
import socketIOClient from "socket.io-client";
import './App.css'


function App() {
  const [response, setResponse] = useState('No response')

  useEffect(() => {
    const socket = socketIOClient(useBackend());
    socket.on('msg', (data: string) => {
      setResponse(data)
    });
  }, [])

  return (
   <>{response}</>
  )
}

function useBackend(): string {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:8000'
  } else {
    return window.location.origin
  }
}

export default App
