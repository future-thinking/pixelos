import { useEffect, useState } from 'react'
import socketIOClient from "socket.io-client";
import './App.css'


function App() {
  useEffect(() => {
    const socket = socketIOClient("http://localhost:8000");
  }, [])

  return (
   <>Hallo</>
  )
}

export default App
