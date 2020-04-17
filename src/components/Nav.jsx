import React, { useState, useEffect } from 'react'
import { Link, animateScroll } from "react-scroll"
import { Transition } from 'react-transition-group'

//Color Imports
import { red } from '../services/colorPallete'

export default function Nav({scroll, langActive, scrollSetter, height}) {
const styles = {
    nav: {
        postition: 'fixed',
        top: '0',
        left: '0',
        display: 'flex',
        flexDirection: 'column',
        width: '15vw',
        paddingTop: '4vh'
    },
        nameText: {
            fontFamily: 'Bebas Neue',
            fontSize: '4vw',
            backgroundColor: 'white'
        },
            first: {
                margin: '1.5vh 0 0 2vw'
            },
            last: {
                margin: '.2vh 0 0 5vw'
            },
        button: {
                flex: '.05',
                fontSize: '1.5vw',
                margin: '0 2vw 0 2vw',
                outline: 'none',
                textAlign: 'left',
                border: 'none',
                borderLeft: 'none',
                backgroundColor: 'rgba(0,0,0,0)',
        },
        buttonActive: {
            flex: '.05',
            fontSize: '1.5vw',
            margin: '0 2vw 0 2vw',
            textAlign: 'left',
            outline: 'none',
            border: 'none',
            borderLeft: `.3vw solid ${red}`,
            transition: 'padding-left 300ms ease-in-out',
            paddingLeft: '1.5vw',
            backgroundColor: 'rgba(0,0,0,0)'
        }
    }
    const transitionStyles = {
      entering: { paddingLeft: 1.5 },
      entered:  { paddingLeft: 1.5 },
      exiting:  { paddingLeft: 0 },
      exited:   { paddingLeft: 0 },
    }
    const duration = 300

const [ activeButton, setActiveButton ] = useState(1)
const [ offset, setOffset ] = useState(0)
const [ style1, setStyle1 ] = useState(styles.buttonActive)
const [ style2, setStyle2 ] = useState(styles.button)
const [ style3, setStyle3 ] = useState(styles.button)
const [ style4, setStyle4 ] = useState(styles.button)
const [ style5, setStyle5 ] = useState(styles.button)
const [ style6, setStyle6 ] = useState(styles.button)
const activeStyleSelector = id => {
    switch (id) {
        case 1:
            setStyle1(styles.buttonActive)
            setStyle2(styles.button)
            setStyle3(styles.button)
            setStyle4(styles.button)
            setStyle5(styles.button)
            setStyle6(styles.button)
            break;
        case 2:
            setStyle1(styles.button)
            setStyle2(styles.buttonActive)
            setStyle3(styles.button)
            setStyle4(styles.button)
            setStyle5(styles.button)
            setStyle6(styles.button)
            break;
        case 3:
            setStyle1(styles.button)
            setStyle2(styles.button)
            setStyle3(styles.buttonActive)
            setStyle4(styles.button)
            setStyle5(styles.button)
            setStyle6(styles.button)
            break;
        case 4:
            setStyle1(styles.button)
            setStyle2(styles.button)
            setStyle3(styles.button)
            setStyle4(styles.buttonActive)
            setStyle5(styles.button)
            setStyle6(styles.button)
            break;
        case 5:
            setStyle1(styles.button)
            setStyle2(styles.button)
            setStyle3(styles.button)
            setStyle4(styles.button)
            setStyle5(styles.buttonActive)
            setStyle6(styles.button)
            break;
        case 6:
            setStyle1(styles.button)
            setStyle2(styles.button)
            setStyle3(styles.button)
            setStyle4(styles.button)
            setStyle5(styles.button)
            setStyle6(styles.buttonActive)
            break;
        default:
            break;
    }
}
 const navHelper = (num) => {
     setActiveButton(num)
     activeStyleSelector(num)
 }
 useEffect(()=>{
     setOffset(langActive ? 400 : 0)
 }, [langActive])
useEffect(()=>{
    if (scroll < 650) navHelper(1)
    if (scroll > document.querySelector('.skills').offsetTop && scroll < document.querySelector('.languages').offsetTop) navHelper(2)
    if (scroll > document.querySelector('.languages').offsetTop && scroll < document.querySelector('.projects').offsetTop ) navHelper(3)
    if (scroll > document.querySelector('.projects').offsetTop && scroll < document.querySelector('.resume').offsetTop ) navHelper(4)
    if (scroll > document.querySelector('.resume').offsetTop && scroll < document.querySelector('.contactMe').offsetTop ) navHelper(5)
    if (scroll > document.querySelector('.contactMe').offsetTop-height*0.5) navHelper(6)
},[scroll])
return(
    <nav style={styles.nav}>
        <h1
        style={{...styles.nameText, ...styles.first}}
        >Brandon</h1>
        <h1
        style={{...styles.nameText, ...styles.last}}
        >Gottshall</h1>

        <br/>

        <Transition in={activeButton===1} timeout={duration}>
                <button style={style1} onClick={()=> {
                    navHelper(1)
                    scrollSetter('.scroll')
                }}>About Me</button>
        </Transition>
        <Transition in={activeButton===2} timeout={duration}>
                <button style={style2} onClick={()=> {
                    navHelper(2)
                    scrollSetter('.skills')
                }}>Skills</button>
        </Transition>
        <Transition in={activeButton===3} timeout={duration}>
            <button style={style3} onClick={()=>{
                navHelper(3)
                scrollSetter('.languages')
            }}>Languages</button>
        </Transition>
        <Transition in={activeButton===4} timeout={duration}>
            <button style={style4} onClick={()=>{
                navHelper(4)
                scrollSetter('.languages')
            }}>Projects</button>
        </Transition>
        <Transition in={activeButton===5} timeout={duration}>
            <button style={style5} onClick={()=>{
                navHelper(5)
                scrollSetter('.resume')
            }}>Resume</button>
        </Transition>
        <Transition in={activeButton===6} timeout={duration}>
        <button style={style6} onClick={()=>{
            navHelper(6)
            scrollSetter('.contactMe')
        }}>Contact Me</button>
        </Transition>
    </nav>
)
}
// console.log(scroll)
