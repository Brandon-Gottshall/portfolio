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
            borderTop: `2vh solid ${red}`,
            position: 'fixed',
            width: '100vw',
            top: '0',
            left: '0'
        },
        scrollBox: {
            display: 'block',
            alignItems: 'center',
            margin: '1vw 0 0 10vw',
            height: '90vh',
            width: '80vw',
            overflowY: 'scroll',
            overflowX: 'hidden'
        }
    }
    return (
        <div style={styles.container}>
            <Nav/>
            <div style={styles.scrollBox}>
                <Profile/>
                <Divider text='Skills' />
                <Skills/>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta eros eget elementum sagittis. Proin at magna imperdiet, suscipit tellus vel, pellentesque diam. Maecenas vitae sem aliquam, fermentum leo eget, porta justo. Aenean et venenatis magna, nec consectetur eros. In aliquam leo lectus, sed hendrerit leo commodo vitae. In maximus cursus orci vel semper. Morbi dictum nisl sodales leo aliquam elementum. Nunc vitae ligula finibus, efficitur diam lobortis, mollis metus. Donec mauris lectus, pretium tempor condimentum porta, varius vel arcu. Morbi vestibulum ligula in rutrum luctus.</p>

                <Divider text='Languages' />
                <Languages/>
            </div>
        </div>
    )
}
