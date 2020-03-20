import React, { useState } from 'react';
import { red } from './services/colorPallete'
import { FaBrain } from 'react-icons/fa'
import jump from 'jump.js'
import { Transition } from 'react-transition-group'

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
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flex: '1',
            height: '100vh',
            marginTop: '10vh'
        },
        nav: {
            postition: 'fixed',
            top: '0',
            left: '0',
            display: 'flex',
            flexDirection: 'column',
            width: '20vw',
            paddingTop: '4vh'
        },
            nameText: {
                fontFamily: 'Bebas Neue',
                fontSize: '4vw'
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
                    margin: '1vh 2vw 0 2vw',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'rgba(0,0,0,0)'
            },
            buttonActive: {
                flex: '.05',
                fontSize: '1.5vw',
                margin: '1vh 2vw 0 2vw',
                textAlign: 'left',
                border: 'none',
                borderLeft: '.2vw solid red',
                transition: `padding-left 300ms ease-in-out`,
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
    const [ style1, setStyle1 ] = useState(styles.buttonActive)
    const [ style2, setStyle2 ] = useState(styles.button)
    const [ style3, setStyle3 ] = useState(styles.button)
    const activeStyleSelector = id => {
        switch (id) {
            case 1:
                setStyle1(styles.buttonActive)
                setStyle2(styles.button)
                setStyle3(styles.button)
                break;
            case 2:
                setStyle1(styles.button)
                setStyle2(styles.buttonActive)
                setStyle3(styles.button)
                break;
            case 3:
                setStyle1(styles.button)
                setStyle2(styles.button)
                setStyle3(styles.buttonActive)
                break;
        }
    }
     const aboutMeHelper = () => {
         console.log('triggered')
         setActiveButton(1)
         activeStyleSelector(1)
     }
     const resumeHelper = () => {
         console.log('triggered')
         setActiveButton(2)
         activeStyleSelector(2)
     }
     const contactMeHelper = () => {
         console.log('triggered')
         setActiveButton(3)
         activeStyleSelector(3)
     }

    return (
    <div style={styles.container}>
        <nav style={styles.nav}>
            <h1 style={{...styles.nameText, ...styles.first}}>Brandon</h1>
            <h1 style={{...styles.nameText, ...styles.last}}>Gottshall</h1>
            <br/>
            <Transition in={activeButton==1} timeout={duration}>
                <button style={style1} onClick={aboutMeHelper}>About Me</button>
            </Transition>
            <Transition in={activeButton==2} timeout={duration}>
                <button style={style2} onClick={resumeHelper}>Resume</button>
            </Transition>
            <Transition in={activeButton==3} timeout={duration}>
                <button style={style3} onClick={contactMeHelper}>Contact Me</button>
            </Transition>
        </nav>
        <div style={styles.scrollBox}>
            <FaBrain size={'10vw'}/>
        </div>
    </div>);
}
