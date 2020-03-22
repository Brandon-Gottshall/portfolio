import React, { useState } from 'react';
import jump from 'jump.js'
//My Component Imports
import Divider from './components/shared/Divider'
import Profile from './components/Profile'
import Nav from './components/Nav'
import Skills from './components/Skills'
import Languages from './components/Languages'
//Color Imports
import { red } from './services/colorPallete'

export default function App() {
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: `2vh solid ${red}`,
            position: 'fixed',
            width: '100vw',
            top: '0',
            left: '0'
        },
        scrollBox: {
            display: 'block',
            alignItems: 'center',
            margin: '0',
            height: '100vh',
            width: '80vw',
            overflowY: 'scroll',
            overflowX: 'hidden'
        }
    }
    return (
        <div style={styles.container}>
            <Nav/>
            <div style={styles.scrollBox}>
                <br/>
                <Profile/>
                <Divider text='Skills' />
                <Skills/>
                <Divider text='Languages' />
                <Languages/>
            <br/>
            </div>
        </div>
    )
}
