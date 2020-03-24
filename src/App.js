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
    const widthSetter = (window.innerWidth > 620) ? ('80vw') : ('100vw')
    const resumeWidthSetter = (window.innerWidth > 620) ? ('60vw') : ('100vw')
    const resumeMarginSetter = (window.innerWidth > 620) ? ('20vw') : ('-9vw')
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
            width: widthSetter,
            overflowY: 'scroll',
            overflowX: 'hidden'
        }
    }
    return (
        <div style={styles.container}>
        {(window.innerWidth > 620) ? (<Nav/>) : (null)}
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
                    <img style={{marginRight: resumeMarginSetter, width: resumeWidthSetter}} src={resume}/>
                </a>
                <Divider text='Contact Me' />
                <br/>
                <Form/>
                <br/>

            </div>
        </div>
    )
}
