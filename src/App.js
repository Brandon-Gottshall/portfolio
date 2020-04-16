import React, { useState, useEffect } from 'react';
import jump from 'jump.js'
//My Component Imports
import Divider from './components/shared/Divider'
import Profile from './components/Profile'
import Nav from './components/Nav'
import Skills from './components/Skills'
import Languages from './components/Languages'
import ResumeImage from './components/ResumeImage'
import Form from './components/Form.js'
//Color Imports
import { red } from './services/colorPallete'
//Image Imports

export default function App() {
    const [ width, setWidth ] = useState(window.innerWidth)
    const [ height, setHeight ] = useState(window.innerHeight)
    const [ scroll, setScroll ] = useState(0)
    const [ langActive, setLangActive ] = useState(false)
    function debounce(fn, ms) {
        let timer
        return _ => {
            clearTimeout(timer)
            timer = setTimeout(_ => {
                timer = null
                fn.apply(this, arguments)
            }, ms)
        };
    }
    function scrollSetter(x) {
        const scrollAmount = x.target.scrollTop

        setScroll(scrollAmount)
    }
    useEffect(()=>{
        const debouncedHandleResize = debounce(function handleResize() {
                setWidth(window.innerWidth)
                setHeight(window.innerHeight)
        }, 1000)
        window.addEventListener('resize', debouncedHandleResize)

        return _ => {
          window.removeEventListener('resize', debouncedHandleResize)
      }
    },[])
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
            width:(width>620)?width*0.78:width,
            overflowY: 'scroll',
            overflowX: 'hidden'
        },
        pdf: {
            width: '10vw'
        },
        resumeContainer: {
            position: 'relative',
            width:'100vw'
        }
    }
    return (
        <div style={styles.container}>
        {(width > 620) ? (<Nav langActive={langActive} scroll={scroll}/>) : (null)}
            <div style={styles.scrollBox} onScroll={scrollSetter}>
                <br/>
                <Profile width={width} height={height}/>
                <Divider text='Skills' />
                <Skills/>
                <Divider text='Languages' />
                <Languages setLangActive={setLangActive}/>
                <br/>
                <Divider text='Resume' />
                <br/>
                <ResumeImage/>
                <Divider text='Contact Me' />
                <br/>
                <Form/>
                <br/>

            </div>
        </div>
    )
}
// console.log(x.target.scrollTop);
