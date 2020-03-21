import React from 'react';
export default function Divider({text}) {
    const lineStyle = {
        width: '100vw',
        backgroundColor: 'red'
    }
    const textStyle = {
        fontSize: '2vw'
    }
    return(<div style={lineStyle}><p style={textStyle}>{text}</p></div>)
}
