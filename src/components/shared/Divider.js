import React from 'react'

//Color Imports
import { red } from '../../services/colorPallete'

export default function Divider({text, width, className}) {
    const container = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '2vw, 0, 2vw, 0'
    }
    const lineStyle = {
        flex: '1',
        marginLeft: '2vw',
        height: (width > 620)?'1vw':'3vw',
        backgroundColor: red
    }
    const textStyle = {
        fontSize: (width > 620)?'2.5vw':'5vw',
        fontStyle: 'italic'
    }
    return(
        <div className={className} style={container}>
            <p style={textStyle}>{text}</p>
            <div style={lineStyle}></div>
        </div>)
}
