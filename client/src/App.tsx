import { useEffect, useState } from 'react'
import './App.css'
import Controls from './Controls';


function App() {
  const [response, setResponse] = useState('No response')

  return (
   <>{response}
  <Controls />
   </>
  )
}



export default App
