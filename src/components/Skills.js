import React, { useState } from 'react'
//Color Imports
import { red } from '../services/colorPallete'
//Icon imports
import { FaBrain, FaHandshake, FaPeopleCarry } from 'react-icons/fa'
import { IoIosBowtie } from "react-icons/io"

export default function Skills() {
    const styles = {
        skillBox: {
            display: 'flex',
            alignItems: 'center',
            height: '6vw',
            justifyContent: 'space-around',
            marginBottom: '1vh'
        },
        icon:{
            width: '5vw',
            height: '5vw'
        },
        iconActive:{
            width: '7vw',
            height: '7vw',
            color: red
        },
        renderContainer: {
            textAlign: 'center'
        }
    }
    const [ growth, setGrowth ] = useState(false)
    const [ responsibility, setResponsibility ] = useState(false)
    const [ teamwork, setTeamwork ] = useState(false)
    const [ profesionalism, setProfesionalism ] = useState(false)
    const [ activeId, setActiveId ] = useState(0)
    const toggle = (state, stateSetter) =>  {
        stateSetter(!state)
    }
    const iconStyleHelper = (state, id) => {
            return(

                (state) ? styles.iconActive : (activeId === id) ? styles.iconActive : styles.icon
            )
    }
    const clickHelper = (id) => {
        (id == activeId) ? setActiveId(0) : setActiveId(id)

    }
    const render = () => {
            switch (activeId) {
                case 1:
                    return (
                        <>
                            <h4>Growth Mindset</h4>

                            <p>I embrace failure as a chance to learn and pivot. I often create goals beyond my current ability, as I know that is the best way to improve my skills.</p>
                        </>
                    )
                case 2:
                    return (
                        <>
                            <h4>Responsibility</h4>

                            <p>During my time in the Marine
                            Corps I was given the responsibility of managing maintenance on over $7,000,000 worth of equipment. I grew with this role, researching and asking constant questions to improve my effectiveness within the role and maintain equipment readiness.</p>
                        </>
                    )
                case 3:
                    return (
                        <>
                            <h4>Teamwork</h4>

                            <p>I've been part of many teams in my adult life but one of the most enjoyable instances was during my time at General Assembly. In a team of three developers, we collaborated with the UX design team to create a reworked version of booking.com with easier accessibility and eco-friendly features.  </p>
                        </>
                    )
                case 4:
                    return (
                        <>
                            <h4>Profesionalism</h4>
                            <p>As an assistant maintenance chief, I was often required to talk to other Marines with much higher rank and pay-grade. I learned to conduct myself with respect and professionalism in the workplace.</p>
                        </>
                    )
                default:
                    return (
                        <h4>Pick an icon explore my skills.</h4>
                    )

            }
    }

    return(
        <div>
            <div style={styles.skillBox}>
                <FaBrain
                    style={iconStyleHelper(growth, 1)}
                    onMouseEnter={() => setGrowth(true)}
                    onMouseLeave={() => setGrowth(false)}
                    onClick={() => clickHelper(1)}
                />
                <FaHandshake
                    style={iconStyleHelper(responsibility, 2)}
                    onMouseEnter={() => setResponsibility(true)}
                    onMouseLeave={() => setResponsibility(false)}
                    onClick={() => clickHelper(2)}
                />
                <FaPeopleCarry
                    style={iconStyleHelper(teamwork, 3)}
                    onMouseEnter={() => setTeamwork(true)}
                    onMouseLeave={() => setTeamwork(false)}
                    onClick={() => clickHelper(3)}
                />
                <IoIosBowtie
                    style={iconStyleHelper(profesionalism, 4)}
                    onMouseEnter={() => setProfesionalism(true)}
                    onMouseLeave={() => setProfesionalism(false)}
                    onClick={() => clickHelper(4)}
                />
            </div>
            <div style={styles.renderContainer}>
            {render()}
            </div>
        </div>
    )
}
