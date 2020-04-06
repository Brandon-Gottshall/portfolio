import React from 'react'
import '../../styles/styles.css'

export default function Divider({text}) {

    return(
        <div className='dividerContainer'>
            <p className='dividerTextStyle'>{text}</p>
            <div className='dividerLineStyle' style={{height:'1vw', width: '80vw', backgroundColor: 'red'}}></div>
        </div>)
}
