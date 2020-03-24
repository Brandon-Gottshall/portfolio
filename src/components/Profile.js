
import React from 'react'

//Color Imports
import { red } from '../services/colorPallete'
// Image imports
import me from '../images/me.png'
// Icon imports
import { GithubIcon, LinkedInIcon } from '../services/svgHelper'


export default function Profile() {
    const profile = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '1vh'
    }
    const styles = {
        nameContaniner: {
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        nameText: {
            fontFamily: 'Bebas Neue',
            fontSize: '10vw',
            backgroundColor: 'white'
        },
            first: {
                marginRight: '2vw'
            },
            last: {
                margin: '0'
            },
    }
    return(
        <>
        {(window.innerWidth > 620) ? (null) : (
            <div style={styles.nameContaniner}>
            <h1
            style={{...styles.nameText, ...styles.first}}
            >Brandon</h1>
            <h1
            style={{...styles.nameText, ...styles.last}}
            >Gottshall</h1>
            </div>
        )}
        <div style={profile}>
            <img style={{maxWidth: '10vw', borderRadius: '50%', border: `.1vw solid black`, marginRight: '0', marginLeft: '5vw'}} src={me} />

        <p style={{maxWidth: '45vw', marginBelow: '5vh', marginLeft: '5vw'}}>A motivated Software Engineer with a highly adaptable skill set acquired through the Marine Corps. Comfortable taking root, and finding success in uncomfortable and difficult situations. Extremely passionate about the tech industry, and always ready to embrace failure, growth, and to demand success.
        <br />
        <div style={{display: 'flex'}}>
        <a href='https://github.com/Brandon-Gottshall'><GithubIcon style={{height:'3vw', width: '3vw'}}/></a>
        <a href='https://www.linkedin.com/in/brandon-gottshall/'><LinkedInIcon style={{height:'3vw', width: '3vw'}}/></a>
        </div>
        </p>

        </div>
        </>
    )
}


// Projects / Work
// Summary of what you did
// Languages, frameworks & databases used
// Link to live project
// Link to your Git-Hub  (ReadMe’s need to be cleaned up and easy to understand!)
