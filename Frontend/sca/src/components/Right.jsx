import React from 'react'
import Button from './Button'

const Right = ({ selectedFile, setSelectedFile, setResult, loading, setLoading }) => {
  const handleCountVehicles = async () => {
    if (!selectedFile) {
      alert("Please upload an image first.")
      return
    }

    const formData = new FormData()
    formData.append("image", selectedFile)

    try {
      setLoading(true)

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Something went wrong")
        return
      }

      setResult(data)
    } catch (error) {
      console.error(error)
      alert("Backend se connect nahi ho paya")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='backdrop-blur-sm h-70 mt-20 rounded-4xl border-amber-600 shadow-lg shadow-black w-150 p-9'>
         <div className=" h-[40vh] w-130 items-center justify-center text-center">
      <p className="text-2xl mb-4 max-w-xl font-semibold">
        Click on the button below to upload image-
      </p>

      <Button setSelectedFile={setSelectedFile} />

      {selectedFile && (
        <p className="text-lg font-medium mt-5 text-black">
          Selected file: {selectedFile.name}
        </p>
      )}

      <button onClick={handleCountVehicles} className="mt-6 px-6 py-3 bg-amber-950 shadow-black shadow-lg border-2 border-black
         text-white rounded-xl text-lg font-semibold hover:scale-102 transition"> {loading ? "Processing..." : "Count Vehicles"}
         </button>
         <div>

         </div>
    </div>
    </div>
   
  )
}

export default Right