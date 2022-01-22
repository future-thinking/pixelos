import { useEffect, useState } from 'react'
import './App.css'
import Controls from './Controls';
import Ping from './Ping';


function App() {
  const [response, setResponse] = useState('No response')

  return (
   <>{response}<Ping />
  <Controls />
   </>
  )
}



export default App
