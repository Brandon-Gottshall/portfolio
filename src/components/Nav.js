import React, { useState } from 'react';
//SASSy imports
import '../styles/styles.css'

export default function Nav() {


    const aboutMeHelper = () => console.log('triggered')
    const resumeHelper = () => {
     console.log('triggered')
    }
    const contactMeHelper = () => {
     console.log('triggered')
    }
    return(
        <nav className='nav'>
            <h1
            className='first'
            >Brandon</h1>
            <h1
            className='last'
            >Gottshall</h1>

            <br/>
                <button className='button 1' onClick={aboutMeHelper}>About Me</button>
                <button className='button 2' onClick={resumeHelper}>Resume</button>
                <button className='button 3' onClick={contactMeHelper}>Contact Me</button>
        </nav>
    )
}


// const styles = {
//     nav: {
//         postition: 'fixed',
//         top: '0',
//         left: '0',
//         display: 'flex',
//         flexDirection: 'column',
//         width: '15vw',
//         paddingTop: '4vh'
//     },
//         nameText: {
//             fontFamily: 'Bebas Neue',
//             fontSize: '4vw',
//             backgroundColor: 'white'
//         },
//             first: {
//                 margin: '1.5vh 0 0 2vw'
//             },
//             last: {
//                 margin: '.2vh 0 0 5vw'
//             },
//         button: {
//                 flex: '.05',
//                 fontSize: '1.5vw',
//                 margin: '0 2vw 0 2vw',
//                 textAlign: 'left',
//                 border: 'none',
//                 backgroundColor: 'rgba(0,0,0,0)'
//         },
//         buttonActive: {
//             flex: '.05',
//             fontSize: '1.5vw',
//             margin: '0 2vw 0 2vw',
//             textAlign: 'left',
//             border: 'none',
//             borderLeft: `.3vw solid ${red}`,
//             transition: 'padding-left 300ms ease-in-out',
//             paddingLeft: '1.5vw',
//             backgroundColor: 'rgba(0,0,0,0)'
//         }
//     }
//     const transitionStyles = {
//       entering: { paddingLeft: 1.5 },
//       entered:  { paddingLeft: 1.5 },
//       exiting:  { paddingLeft: 0 },
//       exited:   { paddingLeft: 0 },
//     }
//     const duration = 300
