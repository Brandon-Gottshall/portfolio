import React, {useState, useEffect} from 'react'
import ProjectRender from './ProjectRender.jsx'
import Divider from './shared/Divider'
//Color Imports
import {red} from '../services/colorPallete'
//Icon imports
import {
    ReactIcon,
    ReactNativeIcon,
    ExpressIcon,
    JSIcon,
    RubyIcon,
    RailsIcon,
    PostgreIcon,
    CSSIcon,
    HTMLIcon
} from '../services/svgHelper'

export default function Languages({setLangActive, width}) {
    const [activeId, setActiveId] = useState(0)

    useEffect(()=>{
        setLangActive(Boolean(activeId))
    },[activeId])

    const clickHelper = id => (id === activeId) ? setActiveId(0) : setActiveId(id)
    const classHelper = id => (id === activeId) ? icon.active : icon.inActive

    const icon = {
        inActive: 'transition duration-500 ease-in-out h-8 w-8 fill-current text-black hover:text-red-def transform hover:-translate-y-1 hover:scale-125',
        active: 'transition duration-500 ease-in-out h-8 w-8 fill-current text-red-def transform scale-125'
    }
    const [icStyles, setIcStyles] = useState({
        react: icon.inActive
    })
    useEffect(() => {
      let tempArr = icStyles
          Object.values(tempArr).forEach((item, i) => {
              (i+1) === activeId ? item = icon.active : item = icon.inActive
          })
        console.log(`This is the temp array ${tempArr}`)
      }, [activeId])

    const styles = {
        languageBox: {
            display: 'flex',
            alignItems: 'center',
            height: '10vw',
            justifyContent: 'space-around',
            marginBottom: '5vh',
            marginTop: '3vh'
        },
        div: {
            width: '8vw',
            height: '8vw'
        },
        icon: {
            transition: `height 200ms ease-in-out`,
            width: (width > 620)?'5vw':'10vw',
            height: (width > 620)?'5vw':'10vw',
        },
        iconActive: {
            transition: `height 200ms ease-in-out`,
            width: (width > 620)?'6vw':'10vw',
            height: (width > 620)?'6vw':'10vw',
            color: red
        },
        renderContainer: {
            textAlign: 'center'
        },
        carousel: {
            backgroundColor: 'red',
            width: width*0.8,
            height: width*1.2
        }
    }

    return (<div>
        <div className="flex items-center justify-center mb-10 mt-8 h-4">
            <div onClick={() => clickHelper(1)}>
                <ReactIcon className="transition duration-500 ease-in-out h-8 w-8 fill-current text-black hover:text-red-def transform hover:-translate-y-1 hover:scale-125"/>
            </div>
        </div>

        <div style={styles.renderContainer}>
            <ProjectRender id={activeId} width={width}/>
        </div>
    </div>)
}

{/* <div style={divStyleHelper(reactNativeIcon, 2)} onMouseEnter={() => setReactNativeIcon(true)} onMouseLeave={() => setReactNativeIcon(false)} onClick={() => clickHelper(2)}>
    <ReactNativeIcon fill={fillHelper(reactNativeIcon, 2)} style={iconStyleHelper(reactNativeIcon, 2)}/>
</div>

<div style={divStyleHelper(expressIcon, 3)} onMouseEnter={() => setExpressIcon(true)} onMouseLeave={() => setExpressIcon(false)} onClick={() => clickHelper(3)}>
    <ExpressIcon fill={fillHelper(expressIcon, 3)} style={iconStyleHelper(expressIcon, 3)}/>
</div>


<div style={divStyleHelper(railsIcon, 4)} onMouseEnter={() => setRailsIcon(true)} onMouseLeave={() => setRailsIcon(false)} onClick={() => clickHelper(4)}>
    <RailsIcon fill={fillHelper(railsIcon, 4)} style={iconStyleHelper(railsIcon, 4)}/>
</div>


<div style={divStyleHelper(postgreIcon, 5)} onMouseEnter={() => setPostgreIcon(true)} onMouseLeave={() => setPostgreIcon(false)} onClick={() => clickHelper(5)}>
    <PostgreIcon fill={fillHelper(postgreIcon, 5)} style={iconStyleHelper(postgreIcon, 5)}/>
</div>

<div style={divStyleHelper(rubyIcon, 6)} onMouseEnter={() => setRubyIcon(true)} onMouseLeave={() => setRubyIcon(false)} onClick={() => clickHelper(6)}>
    <RubyIcon fill={fillHelper(rubyIcon, 6)} style={iconStyleHelper(rubyIcon, 6)}/>
</div>

<div style={divStyleHelper(jSIcon, 7)} onMouseEnter={() => setJSIcon(true)} onMouseLeave={() => setJSIcon(false)} onClick={() => clickHelper(7)}>
    <JSIcon fill={fillHelper(jSIcon, 7)} style={iconStyleHelper(jSIcon, 7)}/>
</div>

<div style={divStyleHelper(hTMLIcon, 8)} onMouseEnter={() => setHTMLIcon(true)} onMouseLeave={() => setHTMLIcon(false)} onClick={() => clickHelper(8)}>
    <HTMLIcon fill={fillHelper(hTMLIcon, 8)} style={iconStyleHelper(hTMLIcon, 8)}/>
</div>

<div style={divStyleHelper(cSSIcon, 9)} onMouseEnter={() => setCSSIcon(true)} onMouseLeave={() => setCSSIcon(false)} onClick={() => clickHelper(9)}>
    <CSSIcon fill={fillHelper(cSSIcon, 9)} style={iconStyleHelper(cSSIcon, 9)}/>
</div> */}


// const iconStyleHelper = (state, id) => (
    // state
    // ? styles.iconActive
    // : (activeId === id)
        // ? styles.iconActive
        // : styles.icon)
// const divStyleHelper = (state, id) => (
    // state
    // ? styles.divActive
    // : (activeId === id)
        // ? styles.divActive
        // : styles.div)
