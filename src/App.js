import React, { useState } from 'react';
import jump from 'jump.js'

//My Component Imports
import Divider from './compoonents/shared/Divider'
import Profile from './compoonents/Profile'
import Nav from './compoonents/Nav'

//Color Imports
import { red } from './services/colorPallete'

//Icon imports
import { FaBrain, FaHandshake, FaPeopleCarry } from 'react-icons/fa'
import { IoIosBowtie } from "react-icons/io";

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
            display: 'block',
            alignItems: 'center',
            margin: '10vh 0  0 10vw',
            height: '100vh',
            width: '70vw',
            overflowY: 'scroll',
            overflowX: 'hidden',

        },
            skillBox: {
                display: 'flex',
                alignItems: 'center',
                height: '10vw',
                justifyContent: 'space-around',
                marginBottom: '10vh'
            },
                icon:{
                    width: '10vw',
                    height: '10vw',
                    margin: '2vw'
                },
                iconActive:{
                    width: '12vw',
                    height: '12vw',
                    color: red
                }
        }

        const [ growth, setGrowth ] = useState(false)
        const [ responsibility, setResponsibility ] = useState(false)
        const [ teamwork, setTeamwork ] = useState(false)
        const [ profesionalism, setProfesionalism ] = useState(false)
        const toggle = (state, stateSetter) =>  {
            stateSetter(!state)
        }
        const iconStyleHelper = state => state ? styles.iconActive : styles.icon

    return (
    <div style={styles.container}>
        <Nav/>
        <div style={styles.scrollBox}>
            <Profile/>
            <div style={styles.skillBox}>
                <FaBrain
                    style={iconStyleHelper(growth)}
                    onMouseEnter={() => setGrowth(true)}
                    onMouseLeave={() => setGrowth(false)}
                />
                <FaHandshake
                    style={iconStyleHelper(responsibility)}/>
                <FaPeopleCarry
                    style={iconStyleHelper(teamwork)}/>
                <IoIosBowtie
                    style={iconStyleHelper(profesionalism)}/>
            </div>


                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta eros eget elementum sagittis. Proin at magna imperdiet, suscipit tellus vel, pellentesque diam. Maecenas vitae sem aliquam, fermentum leo eget, porta justo. Aenean et venenatis magna, nec consectetur eros. In aliquam leo lectus, sed hendrerit leo commodo vitae. In maximus cursus orci vel semper. Morbi dictum nisl sodales leo aliquam elementum. Nunc vitae ligula finibus, efficitur diam lobortis, mollis metus. Donec mauris lectus, pretium tempor condimentum porta, varius vel arcu. Morbi vestibulum ligula in rutrum luctus.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta eros eget elementum sagittis. Proin at magna imperdiet, suscipit tellus vel, pellentesque diam. Maecenas vitae sem aliquam, fermentum leo eget, porta justo. Aenean et venenatis magna, nec consectetur eros. In aliquam leo lectus, sed hendrerit leo commodo vitae. In maximus cursus orci vel semper. Morbi dictum nisl sodales leo aliquam elementum. Nunc vitae ligula finibus, efficitur diam lobortis, mollis metus. Donec mauris lectus, pretium tempor condimentum porta, varius vel arcu. Morbi vestibulum ligula in rutrum luctus.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta eros eget elementum sagittis. Proin at magna imperdiet, suscipit tellus vel, pellentesque diam. Maecenas vitae sem aliquam, fermentum leo eget, porta justo. Aenean et venenatis magna, nec consectetur eros. In aliquam leo lectus, sed hendrerit leo commodo vitae. In maximus cursus orci vel semper. Morbi dictum nisl sodales leo aliquam elementum. Nunc vitae ligula finibus, efficitur diam lobortis, mollis metus. Donec mauris lectus, pretium tempor condimentum porta, varius vel arcu. Morbi vestibulum ligula in rutrum luctus.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta eros eget elementum sagittis. Proin at magna imperdiet, suscipit tellus vel, pellentesque diam. Maecenas vitae sem aliquam, fermentum leo eget, porta justo. Aenean et venenatis magna, nec consectetur eros. In aliquam leo lectus, sed hendrerit leo commodo vitae. In maximus cursus orci vel semper. Morbi dictum nisl sodales leo aliquam elementum. Nunc vitae ligula finibus, efficitur diam lobortis, mollis metus. Donec mauris lectus, pretium tempor condimentum porta, varius vel arcu. Morbi vestibulum ligula in rutrum luctus.</p>
        </div>
    </div>);
}
