import React, { useState, useEffect } from 'react';
//My Component Imports
import Divider from './components/shared/Divider'
import Profile from './components/Profile.jsx'
import Nav from './components/Nav'
import Skills from './components/Skills'
import Languages from './components/Languages.jsx'
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
    function jumpHelper(target) {
        console.log('jumped')
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
            overflowY: 'visible',
            overflowX: 'hidden',
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
                <Profile width={width} height={height} jumpHelper={jumpHelper}/>
                <Divider width={width} text='Skills' />
                <Skills width={width} className='skills'/>
                <Divider width={width} text='Languages' />
                <Languages width={width} setLangActive={setLangActive}/>
                <br/>
                <Divider width={width} text='Resume' />
                <br/>
                <ResumeImage/>
                <Divider width={width} text='Contact Me' />
                <br/>
                <Form/>
                <br/>

            </div>
        </div>
    )
}
// console.log(x.target.scrollTop);
