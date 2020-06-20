import React, { useState, useEffect } from 'react'

//Color Imports

export default function Nav({scroll, langActive, scrollSetter, height}) {

const styles = {
        button: "text-lg mx-8 mt-2 outline-none text-left transition-padding duration-500 ease-in-out",
        buttonActive: "text-lg mx-8 mt-2 outline-none text-left pl-3 border-l-4 border-red-def rounded transition-padding duration-500 ease-in-out"
    }

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
     activeStyleSelector(num)
 }
// useEffect(()=>{
//     if (scroll < 650) navHelper(1)
//     if (scroll > document.querySelector('.skills').offsetTop && scroll < document.querySelector('.projects').offsetTop) navHelper(2)
//     if (scroll > document.querySelector('.projects').offsetTop && scroll < document.querySelector('.resume').offsetTop ) navHelper(3)
//     if (scroll > document.querySelector('.resume').offsetTop && scroll < document.querySelector('.contactMe').offsetTop ) navHelper(5)
//     if (scroll > document.querySelector('.contactMe').offsetTop-height*0.5) navHelper(6)
// },[scroll])
return(
    <nav className="top-0 left-0 mr-1 mt-12 hidden flex-col flex-grow w-1/3 sm:flex" >
        <h1 className="font-bebas text-3xl ml-3">Brandon</h1>
        <h1 className="font-bebas text-3xl ml-8 mb-16">Gottshall</h1>

        <button className={style1} onClick={()=> {
            navHelper(1)
            scrollSetter('.scroll')
        }}>About Me</button>

        <button className={style2} onClick={()=> {
            navHelper(2)
            scrollSetter('.skills')
        }}>Skills</button>

        <button className={style3} onClick={()=>{
            navHelper(3)
            scrollSetter('.projects')
        }}>Projects</button>

        <button className={style5} onClick={()=>{
            navHelper(5)
            scrollSetter('.resume')
        }}>Resume</button>

        <button className={style6} onClick={()=>{
            navHelper(6)
            scrollSetter('.contactMe')
        }}>Contact Me</button>

    </nav>
)
}
