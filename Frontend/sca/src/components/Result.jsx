import React from 'react'

const Result = ({ result, handleClear }) => {
  return (
    <div className="w-[90%] max-w-6xl mx-auto mt-10 mb-10 bg-amber-500/80 backdrop-blur-md rounded-4xl shadow-black shadow-2xl p-9">
      <h2 className="text-4xl uppercase font-bold text-center mb-8">Results</h2>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center">
          <img
            src={result.image_url}
            alt="errorr"
            className="shadow-lg shadow-black max-h-125 object-contain"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-amber-900 shadow-black text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Total Vehicles-</h3>
            <p className="text-5xl font-bold">{result.total_vehicles}</p>
          </div>

          <div className="bg-amber-900 shadow-black rounded-2xl p-6 shadow-lg border">
            <h3 className="text-2xl text-white font-semibold mb-4">Class-wise Count-</h3>

            {Object.keys(result.class_wise_count).length === 0 ? (
              <p>No vehicles detected.</p>
            ) : (
              <ul className="space-y-3 text-white ">
                {Object.entries(result.class_wise_count).map(([vehicle, count]) => (
                  <li
                    key={vehicle}
                    className="flex justify-between border-b pb-2 text-lg"
                  >
                    <span className="capitalize">{vehicle}</span>
                    <span className="font-bold">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
     <div>
      <button className='border-2 px-2 py-2 bg-amber-800 rounded-2xl font-semibold text-white border-black shadow-md shadow-black' onClick={handleClear}>Try Another Image</button>
    </div>
    </div>
  )
}

export default Result