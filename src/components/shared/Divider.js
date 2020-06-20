import React from 'react'

export default function Divider({text, width, className}) {
    return(
            <div className={className + "flex items-center justify-between mx-1"}>
                <p className="text-1xl">{text}</p>
                <div className="w-10/12 h-2 bg-red-def -mr-5 rounded sm:h-3 md:w-11/12"></div>
            </div>)
}
