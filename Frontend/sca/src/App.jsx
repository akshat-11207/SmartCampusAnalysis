import React, { useState } from 'react'
import Right from './components/Right'
import Left from './components/Left'
import Navbar from './components/Navbar'
import Result from './components/Result'

const App = () => {
  // we will usee state variables to store image and result
  const [selectedFile, setSelectedFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

    const handleClear = () => {
    setSelectedFile(null)
    setResult(null)
    setPreviewUrl(null)
  }

  return (
     
    <div>
      <div
        style={{
          backgroundImage: "url('https://i.ibb.co/PzrP21wQ/iitbhu.png')"
        }}
        className="bg-center min-h-screen bg-cover"
      >
        <Navbar />

        <div className="flex min-h-[80vh]">
          <Left />
          <Right
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setResult={setResult}
            loading={loading}
            setLoading={setLoading}
            
          />
        </div>
      </div>

      {result && <Result result={result} handleClear={handleClear} />}
      
    </div>
   
  )
}

export default App