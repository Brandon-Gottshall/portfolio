
import React from 'react'

//Color Imports
import { red } from '../services/colorPallete'
// Image imports
import me from '../images/me.png'
// Icon imports
import { GithubIcon, LinkedInIcon } from '../services/svgHelper'


export default function Profile({width, height}) {
    const profile = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        marginLeft: (width > 620)?'5vw':'auto',
        marginBottom: '1vh',
        marginTop: '10vh',
        height: '50vh'
    }
    const styles = {
        nameContaniner: {
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '5vh'
        },
        profileImage: {
            width: width*0.2,
            borderRadius: '50%',
            border: `.1vw solid black`,
        },
        nameText: {
            fontFamily: 'Bebas Neue',
            fontSize: '48px'
        },
        mission: {
            width: (width > 620)?width*0.6:width*0.8,
            textAlign: 'center',
            fontSize: '22px'
        },
        iconContainer: {
            display: 'flex',
            marginTop: (width > 620)?'1.5vw':'5vw',
            marginBottom: (width > 620)?'0':'5vw',
            height: width*0.04,
            justifyContent: 'center',
            alignItems: 'center'
        },
            icon: {
                height:(width > 620)?'3vw':'10vw',
                width: (width > 620)?'3vw':'10vw',
                margin: (width > 620)?'0.5vw':'1vw'
            }
    }
    return(
        <>
        <div style={profile}>
            {(window.innerWidth > 620) ? (null) : (
                <div style={styles.nameContaniner}>
                    <h1 style={styles.nameText}>Brandon Gottshall</h1>
                </div>
            )}
            <img style={styles.profileImage} alt="Brandon Gottshall" src={me} />

            <p style={styles.mission}>A motivated Software Engineer with a highly adaptable skill set acquired through the Marine Corps. Comfortable taking root, and finding success in uncomfortable and difficult situations. Extremely passionate about the tech industry, and always ready to embrace failure, growth, and to demand success.
                <br />
                <div style={styles.iconContainer}>
                    <a href='https://github.com/Brandon-Gottshall'><GithubIcon style={styles.icon}/></a>
                    <a href='https://www.linkedin.com/in/brandon-gottshall/'><LinkedInIcon style={styles.icon}/></a>
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
