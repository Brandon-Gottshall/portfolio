import React, { useState, useEffect } from 'react';
import resume from "../resume.png"



export default function ResumeImage() {
    const [ width, setWidth ] = useState((window.innerWidth > 620) ? (window.innerWidth*0.787) : (window.innerWidth*0.95))
    const [ height, setHeight ] = useState((window.innerWidth > 620) ? ((window.innerWidth*0.787)*1.3) : ((window.innerWidth*0.95)*1.3))
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

    useEffect(()=>{
        const debouncedHandleResize = debounce(function handleResize() {
            if (window.innerWidth > 620) {
                setWidth(window.innerWidth*0.787)
                setHeight((window.innerWidth*0.777)*1.3)
            } else if (window.innerWidth < 620) {
                setWidth(window.innerWidth*0.95)
                setHeight((window.innerWidth*0.95)*1.3)
            }
        }, 1000)
        window.addEventListener('resize', debouncedHandleResize)

        return _ => {
          window.removeEventListener('resize', debouncedHandleResize)
      }
    },[])
    const styles = {
        cont: {
            display: 'flex'
        },
        image: {
            width: width,
            height: height
        }
    }

    return (
        <a target='_blank' rel="noopener noreferrer" style={styles.cont} href='https://www.gottshall.dev/Resume.pdf'>
            <img style={styles.image} src={resume} alt="My Resume"/>
        </a>
    )
}
