import React from 'react'

function Spinner() {
  return (
    <div>
     <div className="loadingSpinnerContainer"></div>
      <div className="loadingSpinner"></div>
        <p className="loadingText">Fetching data...</p> 
    </div>
  )
}

export default Spinner

