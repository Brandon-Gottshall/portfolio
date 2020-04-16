import React, { useState, useEffect } from 'react';
import { Transition } from 'react-transition-group'

//Color Imports
import { red } from '../services/colorPallete'

export default function Nav({scroll, langActive}) {
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
                textAlign: 'left',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0)'
        },
        buttonActive: {
            flex: '.05',
            fontSize: '1.5vw',
            margin: '0 2vw 0 2vw',
            textAlign: 'left',
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

const [activeButton, setActiveButton] = useState(1)
const [offset, setOffset] = useState(0)
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
     console.log(langActive)
 }, [langActive])
useEffect(()=>{
    console.log(scroll)
    if (scroll < 390) navHelper(1)
    if (scroll > 390 && scroll < 614) navHelper(2)
    if (scroll > 614 && scroll < 805 ) navHelper(3)
    if (scroll > 805 && scroll < (1000+offset) ) navHelper(4)
    if (scroll > (1000+offset) && scroll < (2226+offset) ) navHelper(5)
    if (scroll > (2226+offset)) navHelper(6)
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
            <button style={style1} onClick={()=>navHelper(1)}>About Me</button>
        </Transition>
        <Transition in={activeButton===2} timeout={duration}>
            <button style={style2} onClick={()=>navHelper(2)}>Skills</button>
        </Transition>
        <Transition in={activeButton===3} timeout={duration}>
            <button style={style3} onClick={()=>navHelper(3)}>Languages</button>
        </Transition>
        <Transition in={activeButton===4} timeout={duration}>
            <button style={style4} onClick={()=>navHelper(4)}>Projects</button>
        </Transition>
        <Transition in={activeButton===5} timeout={duration}>
            <button style={style5} onClick={()=>navHelper(5)}>Resume</button>
        </Transition>
        <Transition in={activeButton===6} timeout={duration}>
        <button style={style6} onClick={()=>navHelper(6)}>Contact Me</button>
        </Transition>
    </nav>
)
}
