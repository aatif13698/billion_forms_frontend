import React from 'react'

function Hamberger({text}) {
    return (
        <div className="bg-hambergerLight dark:bg-hambergerDark px-2 py-3 mb-3">
            <span>{text}</span>
        </div>
    )
}

export default Hamberger
