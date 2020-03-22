import React from 'react'

//Color Imports
import { red } from '../../services/colorPallete'

export default function Divider({text}) {
    const container = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '2vw, 0, 2vw, 0'
    }
    const lineStyle = {
        flex: '1',
        marginLeft: '2vw',
        height: '3vh',
        backgroundColor: red
    }
    const textStyle = {
        fontSize: '2vw',
        fontStyle: 'italic'
    }
    return(
        <div style={container}>
            <p style={textStyle}>{text}</p>
            <div style={lineStyle}></div>
        </div>)
}
