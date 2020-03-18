import React from 'react';
import { red } from './services/colorPallete'

export default function App() {
    const styles = {
        header: {
            display: 'flex',
            flexDirection: 'column'
        },
        redLine: {
            backgroundColor: red,
            height: '2vh',
            width: '100vw'
        },
        nameText: {
            fontFamily: 'Bebas Neue',
            fontSize: '6vw'
        },
        first: {
            margin: '1.5vh 0 0 2vw'
        },
        last: {
            margin: '.2vh 0 0 5vw'
        }
    }
    return (
    <div>
        <header style={styles.header}>
            <div style={styles.redLine}></div>
            <h1 style={{...styles.nameText, ...styles.first}}>Brandon</h1>
            <h1 style={{...styles.nameText, ...styles.last}}>Gottshall</h1>
        </header>
        <div stlye={styles.pageContent}>
            
        </div>
    </div>);
}
