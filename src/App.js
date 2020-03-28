import React, { useState } from 'react';
import jump from 'jump.js'
//My Component Imports
import Divider from './components/shared/Divider'
import Profile from './components/Profile'
import Nav from './components/Nav'
import Skills from './components/Skills'
import Languages from './components/Languages'
import Form from './components/Form.js'
//SAASy imports
import './styles/styles.css'
import { red } from './services/colorPallete'
//Image Imports
import resume from './images/Resume.png'

export default function App() {

    return (
        <div className='appContainer'>
            <Nav/>
            <div className='contentScrollBox'>
                <br/>
                <Profile/>
                <Divider text='Skills' />
                <Skills/>
                <Divider text='Languages' />
                <Languages/>
                <br/>
                <Divider text='Resume' />
                <br/>
                <a href='https://www.gottshall.dev/Resume.pdf'>
                        
                    </a>
                    <Divider text='Contact Me' />
                    <br/>
                    <Form/>
                    <br/>

                </div>
        </div>
    )
}


// const widthSetter = (window.innerWidth > 620) ? ('80vw') : ('100vw')
// const resumeWidthSetter = (window.innerWidth > 620) ? ('60vw') : ('100vw')
// const resumeMarginSetter = (window.innerWidth > 620) ? ('20vw') : ('-9vw')
// const styles = {
//     appContainer: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         borderTop: `2vh solid ${red}`,
//         position: 'fixed',
//         width: '100vw',
//         top: '0',
//         left: '0'
//     },
//     contentScrollBox: {
//         display: 'block',
//         alignItems: 'center',
//         margin: '0',
//         height: '100vh',
//         width: widthSetter,
//         overflowY: 'scroll',
//         overflowX: 'hidden'
//     }
// }
