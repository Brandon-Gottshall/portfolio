import React, { useState } from 'react'
import { Transition } from 'react-transition-group'
import ProjectRender from './ProjectRender'
//Color Imports
import { red } from '../services/colorPallete'
//Icon imports
import { ReactIcon,
         ReactNativeIcon,
         ExpressIcon,
         JSIcon,
         RubyIcon,
         RailsIcon,
         PostgreIcon,
         CSSIcon,
         HTMLIcon     } from '../services/svgHelper'

export default function Skills() {
    const [ reactIcon, setReactIcon ] = useState(false)
    const [ reactNativeIcon, setReactNativeIcon] = useState(false)
    const [ jSIcon, setJSIcon] = useState(false)
    const [ expressIcon, setExpressIcon] = useState(false)
    const [ rubyIcon, setRubyIcon] = useState(false)
    const [ railsIcon, setRailsIcon] = useState(false)
    const [ postgreIcon, setPostgreIcon] = useState(false)
    const [ hTMLIcon, setHTMLIcon] = useState(false)
    const [ cSSIcon, setCSSIcon] = useState(false)
    const [ activeId, setActiveId] = useState(0)
    const transitionStyles = {
        entering: { width: '8vw', height: '8vw' },
        entered:  { width: '8vw', height: '8vw' },
        exiting:  { width: '8vw', height: '10vw' },
        exited:   { width: '8vw', height: '10vw' },
    }
    const duration = 600
    const iconStyleHelper = (state, id) => (state ? styles.iconActive : (activeId === id) ? styles.iconActive : styles.icon)
    const divStyleHelper = (state, id) => (state ? styles.divActive : (activeId === id) ? styles.divActive : styles.div)
    const fillHelper =(state, id) => (state ? red : (activeId === id) ? red : 'black')
    const clickHelper = id => (id == activeId) ? setActiveId(0) : setActiveId(id)

    const render = () => (<ProjectRender id={activeId}/>)
    const styles = {
        languageBox: {
            display: 'flex',
            alignItems: 'center',
            height: '10vw',
            justifyContent: 'space-around',
            marginBottom: '10vh'
        },
        div:{
            transition: `width ${duration}ms ease-in-out`,
            transition: `height ${duration}ms ease-in-out`,
            width: '8vw',
            height: '8vw'
        },
        divActive:{
            transition: `width ${duration}ms ease-in-out`,
            transition: `height ${duration}ms ease-in-out`,
            width: '8vw',
            height: '10vw'
        },
        icon:{
            transition: `width ${duration}ms ease-in-out`,
            transition: `height ${duration}ms ease-in-out`,
            width: '5vw',
            height: '5vw',
            margin: '2vw'
        },
        iconActive:{
            transition: `width ${duration}ms ease-in-out`,
            transition: `height ${duration}ms ease-in-out`,
            width: '6vw',
            height: '6vw',
            color: red,
            margin: '2vw 0 2vw 1.5vw'
        },
        renderContainer: {
            border: `.3vw solid ${red}`,
            textAlign: 'center'
        }
    }

    return(
        <div>
            <div style={styles.languageBox}>
                <Transition in={reactIcon} timeout={duration}>
                    <div
                        style={divStyleHelper(reactIcon, 1)}
                        onMouseEnter={() => setReactIcon(true)}
                        onMouseLeave={() => setReactIcon(false)}
                        onClick={() => clickHelper(1)}>
                        <ReactIcon fill={fillHelper(reactIcon, 1)} style={iconStyleHelper(reactIcon, 1)}/>
                    </div>
                </Transition>
                <Transition in={reactNativeIcon} timeout={duration}>
                    <div
                        style={divStyleHelper(reactNativeIcon, 2)}
                        onMouseEnter={() => setReactNativeIcon(true)}
                        onMouseLeave={() => setReactNativeIcon(false)}
                        onClick={() => clickHelper(2)}>
                        <ReactNativeIcon fill={fillHelper(reactNativeIcon, 2)} style={iconStyleHelper(reactNativeIcon, 2)} />
                    </div>
                </Transition>
                <Transition in={jSIcon} timeout={duration}>
                    <div
                        style={divStyleHelper(jSIcon, 3)}
                        onMouseEnter={() => setJSIcon(true)}
                        onMouseLeave={() => setJSIcon(false)}
                        onClick={() => clickHelper(3)}>
                        <JSIcon fill={fillHelper(jSIcon, 3)} style={iconStyleHelper(jSIcon, 3)} />
                    </div>
                </Transition>
                <Transition in={expressIcon} timeout={duration}>
                    <div
                        style={divStyleHelper(expressIcon, 4)}
                        onMouseEnter={() => setExpressIcon(true)}
                        onMouseLeave={() => setExpressIcon(false)}
                        onClick={() => clickHelper(4)}>
                        <ExpressIcon fill={fillHelper(expressIcon, 4)} style={iconStyleHelper(expressIcon, 4)} />
                    </div>
                </Transition>
                <Transition in={rubyIcon} timeout={duration}>
                    <div style={divStyleHelper(rubyIcon, 5)}
                        onMouseEnter={() => setRubyIcon(true)}
                        onMouseLeave={() => setRubyIcon(false)}
                        onClick={() => clickHelper(5)}>
                        <RubyIcon fill={fillHelper(rubyIcon, 5)} style={iconStyleHelper(rubyIcon, 5)} />
                    </div>
                </Transition>
                <Transition in={railsIcon} timeout={duration}>
                    <div
                        style={divStyleHelper(railsIcon, 6)}
                        onMouseEnter={() => setRailsIcon(true)}
                        onMouseLeave={() => setRailsIcon(false)}
                        onClick={() => clickHelper(6)}>
                        <RailsIcon fill={fillHelper(railsIcon, 6)} style={iconStyleHelper(railsIcon, 6)} />
                    </div>
                </Transition>
                <Transition in={postgreIcon} timeout={duration}>
                    <div
                        style={divStyleHelper(postgreIcon, 7)}
                        onMouseEnter={() => setPostgreIcon(true)}
                        onMouseLeave={() => setPostgreIcon(false)}
                        onClick={() => clickHelper(7)}>
                        <PostgreIcon fill={fillHelper(postgreIcon, 7)} style={iconStyleHelper(postgreIcon, 7)} />
                    </div>
                </Transition>
                <Transition in={hTMLIcon} timeout={duration}>
                    <div
                        style={divStyleHelper(hTMLIcon, 8)}
                        onMouseEnter={() => setHTMLIcon(true)}
                        onMouseLeave={() => setHTMLIcon(false)}
                        onClick={() => clickHelper(8)}>
                        <HTMLIcon  fill={fillHelper(hTMLIcon, 8)} style={iconStyleHelper(hTMLIcon, 8)} />
                    </div>
                </Transition>
                <Transition in={cSSIcon} timeout={duration}>
                    <div
                        style={divStyleHelper(cSSIcon, 9)}
                        onMouseEnter={() => setCSSIcon(true)}
                        onMouseLeave={() => setCSSIcon(false)}
                        onClick={() => clickHelper(9)}>
                        <CSSIcon fill={fillHelper(cSSIcon, 9)} style={iconStyleHelper(cSSIcon, 9)} />
                    </div>
                </Transition>
            </div>
            <div style={styles.renderContainer}>
            <ProjectRender id={activeId} />
            </div>
        </div>
    )
}
