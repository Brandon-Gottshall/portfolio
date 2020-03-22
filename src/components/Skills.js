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
            border: `.3vw solid ${red}`,
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
                        <p>Growth</p>
                    )
                case 2:
                    return (
                        <p>Responsibility</p>
                    )
                case 3:
                    return (
                        <p>Teamwork</p>
                    )
                case 4:
                    return (
                        <p>Profesionalism</p>
                    )
                default:
                    return (
                        <p>Nothing is selected.</p>
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
