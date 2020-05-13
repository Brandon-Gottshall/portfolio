import React, { useState, useEffect } from 'react'
//Component Imports
import Divider from './components/shared/Divider'
import Profile from './components/Profile.jsx'
import Nav from './components/Nav'
import Skills from './components/Skills'
import Languages from './components/Languages.jsx'
import ResumeImage from './components/ResumeImage'
import Form from './components/Form.js'
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
    function scrollFinder(x) {
            const scrollAmount = x.target.scrollTop
            setScroll(scrollAmount)
        }
    function scrollSetter(target) {
        let scrollNode = document.querySelector('.scroll')
        let skillsNode = document.querySelector(target)
        scrollNode.scrollTop=skillsNode.offsetTop+1
        setScroll(skillsNode.offsetTop)
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
    return (
        <div className="flex justify-between border-t-16 border-red-def fixed w-screen top-0 left-0">
            <Nav langActive={langActive} height={height} scroll={scroll} scrollSetter={scrollSetter}/>
                <div className="block mx-1 h-screen flex-grow-04 w-full overflow-y-auto"
                     onScroll={scrollFinder}>
                    <br/>
                    <Profile width={width} height={height} scrollSetter={scrollSetter}/>
                    <Divider width={width} text='Skills' className='skills'/>
                    <Skills width={width}/>
                    <Divider width={width} text='Projects' className='projects' />
                    <Languages width={width} setLangActive={setLangActive}/>
                    <br/>
                    <Divider width={width} text='Resume' className='resume' />
                    <br/>
                    <ResumeImage/>
                    <Divider width={width} text='Contact Me' className='contactMe'  />
                    <br/>
                    <Form/>
                    <br/>
                </div>
        </div>
    )
}
