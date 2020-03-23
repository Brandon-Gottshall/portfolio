import React, { useState } from 'react';
import jump from 'jump.js'
//My Component Imports
import Divider from './components/shared/Divider'
import Profile from './components/Profile'
import Nav from './components/Nav'
import Skills from './components/Skills'
import Languages from './components/Languages'
import Form from './components/Form.js'
//Color Imports
import { red } from './services/colorPallete'
//Image Imports
import resume from './images/Resume.png'

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
                <Divider text='Resume' />
                <br/>
            <a style={{display: 'flex', justifyContent: 'flex-end', width: '90vw'}} href='https://www.gottshall.dev/Resume.pdf'>
                    <img style={{marginRight: '20vw', width: '60vw'}} src={resume}/>
                </a>
                <Divider text='Contact Me' />
                <br/>
                <Form/>
                <br/>

            </div>
        </div>
    )
}
