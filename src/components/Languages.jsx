import React, {useState, useEffect} from 'react'
import '@brainhubeu/react-carousel/lib/style.css';
import {Transition} from 'react-transition-group'
import ProjectRender from './ProjectRender'
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
    const [reactIcon, setReactIcon] = useState(false)
    const [reactNativeIcon, setReactNativeIcon] = useState(false)
    const [jSIcon, setJSIcon] = useState(false)
    const [expressIcon, setExpressIcon] = useState(false)
    const [rubyIcon, setRubyIcon] = useState(false)
    const [railsIcon, setRailsIcon] = useState(false)
    const [postgreIcon, setPostgreIcon] = useState(false)
    const [hTMLIcon, setHTMLIcon] = useState(false)
    const [cSSIcon, setCSSIcon] = useState(false)
    const [activeId, setActiveId] = useState(0)
    useEffect(()=>{
        setLangActive(Boolean(activeId))
    },[activeId])
    const iconStyleHelper = (state, id) => (
        state
        ? styles.iconActive
        : (activeId === id)
            ? styles.iconActive
            : styles.icon)
    const divStyleHelper = (state, id) => (
        state
        ? styles.divActive
        : (activeId === id)
            ? styles.divActive
            : styles.div)
    const fillHelper = (state, id) => (
        state
        ? red
        : (activeId === id)
            ? red
            : 'black')
    const clickHelper = id => (id === activeId)
        ? setActiveId(0)
        : setActiveId(id)

    const render = () => (<ProjectRender id={activeId}/>)

    const duration = 400
    const transitionStyles = {
        entering: {
            width: '8vw',
            height: '8vw'
        },
        entered: {
            width: '8vw',
            height: '8vw'
        },
        exiting: {
            width: '8vw',
            height: '10vw'
        },
        exited: {
            width: '8vw',
            height: '10vw'
        }
    }
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
            transition: `height ${duration}ms ease-in-out`,
            width: '8vw',
            height: '8vw'
        },
        divActive: {
            transition: `height ${duration}ms ease-in-out`,
            width: '8vw',
            height: '10vw'
        },
        icon: {
            transition: `height ${duration}ms ease-in-out`,
            width: (width > 620)?'5vw':'10vw',
            height: (width > 620)?'5vw':'10vw',
        },
        iconActive: {
            transition: `height ${duration}ms ease-in-out`,
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
        <div style={styles.languageBox}>
            <Transition in={reactIcon} timeout={duration}>
                <div style={divStyleHelper(reactIcon, 1)} onMouseEnter={() => setReactIcon(true)} onMouseLeave={() => setReactIcon(false)} onClick={() => clickHelper(1)}>
                    <ReactIcon fill={fillHelper(reactIcon, 1)} style={iconStyleHelper(reactIcon, 1)}/>
                </div>
            </Transition>
            <Transition in={reactNativeIcon} timeout={duration}>
                <div style={divStyleHelper(reactNativeIcon, 2)} onMouseEnter={() => setReactNativeIcon(true)} onMouseLeave={() => setReactNativeIcon(false)} onClick={() => clickHelper(2)}>
                    <ReactNativeIcon fill={fillHelper(reactNativeIcon, 2)} style={iconStyleHelper(reactNativeIcon, 2)}/>
                </div>
            </Transition>
            <Transition in={expressIcon} timeout={duration}>
                <div style={divStyleHelper(expressIcon, 3)} onMouseEnter={() => setExpressIcon(true)} onMouseLeave={() => setExpressIcon(false)} onClick={() => clickHelper(3)}>
                    <ExpressIcon fill={fillHelper(expressIcon, 3)} style={iconStyleHelper(expressIcon, 3)}/>
                </div>
            </Transition>
            <Transition in={railsIcon} timeout={duration}>
                <div style={divStyleHelper(railsIcon, 4)} onMouseEnter={() => setRailsIcon(true)} onMouseLeave={() => setRailsIcon(false)} onClick={() => clickHelper(4)}>
                    <RailsIcon fill={fillHelper(railsIcon, 4)} style={iconStyleHelper(railsIcon, 4)}/>
                </div>
            </Transition>

            <Transition in={postgreIcon} timeout={duration}>
                <div style={divStyleHelper(postgreIcon, 5)} onMouseEnter={() => setPostgreIcon(true)} onMouseLeave={() => setPostgreIcon(false)} onClick={() => clickHelper(5)}>
                    <PostgreIcon fill={fillHelper(postgreIcon, 5)} style={iconStyleHelper(postgreIcon, 5)}/>
                </div>
            </Transition>
            <Transition in={rubyIcon} timeout={duration}>
                <div style={divStyleHelper(rubyIcon, 6)} onMouseEnter={() => setRubyIcon(true)} onMouseLeave={() => setRubyIcon(false)} onClick={() => clickHelper(6)}>
                    <RubyIcon fill={fillHelper(rubyIcon, 6)} style={iconStyleHelper(rubyIcon, 6)}/>
                </div>
            </Transition>
            <Transition in={jSIcon} timeout={duration}>
                <div style={divStyleHelper(jSIcon, 7)} onMouseEnter={() => setJSIcon(true)} onMouseLeave={() => setJSIcon(false)} onClick={() => clickHelper(7)}>
                    <JSIcon fill={fillHelper(jSIcon, 7)} style={iconStyleHelper(jSIcon, 7)}/>
                </div>
            </Transition>
            <Transition in={hTMLIcon} timeout={duration}>
                <div style={divStyleHelper(hTMLIcon, 8)} onMouseEnter={() => setHTMLIcon(true)} onMouseLeave={() => setHTMLIcon(false)} onClick={() => clickHelper(8)}>
                    <HTMLIcon fill={fillHelper(hTMLIcon, 8)} style={iconStyleHelper(hTMLIcon, 8)}/>
                </div>
            </Transition>
            <Transition in={cSSIcon} timeout={duration}>
                <div style={divStyleHelper(cSSIcon, 9)} onMouseEnter={() => setCSSIcon(true)} onMouseLeave={() => setCSSIcon(false)} onClick={() => clickHelper(9)}>
                    <CSSIcon fill={fillHelper(cSSIcon, 9)} style={iconStyleHelper(cSSIcon, 9)}/>
                </div>
            </Transition>
        </div>
        <div style={styles.renderContainer}>
            <Divider width={width} text='Projects'/>
            <ProjectRender id={activeId}/>
        </div>
    </div>)
}
