import React from 'react'
//Color Imports
import { red } from '../services/colorPallete'
// Image imports
import me from '../images/me.png'
// Icon imports
import { GithubIcon, LinkedInIcon } from '../services/svgHelper'
import { Arrow } from '../services/svgHelper.js'


export default function Profile({width, height, scrollSetter}) {
    const profile = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 'auto',
        marginLeft: (width > 620)?'5vw':'auto',
        marginBottom: (width > 620)?height*0.01:(width > 320)?0:0,
        marginTop: (width > 620)?height*0.1:(width > 320)?'-10px':0,
        height: (width > 620)?height:(width > 321)?height:height,
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
            fontSize: (width > 321)?'48px':'38px',
            marginTop: (width > 620)?0:(width > 321)?0:0
        },
        mission: {
            width: (width > 620)?width*0.6:width*0.8,
            textAlign: 'center',
            fontSize: (width > 620)?'22px':'15px'
        },
        iconContainer: {
            display: 'flex',
            marginTop: (width > 620)?'1.5vw':'10vw',
            height: width*0.04,
            justifyContent: 'space-around',
            marginBottom: (width > 620)?height*0.1:(width > 321)?height*0.15:height*0.2,
            alignItems: 'center'
        },
            icon: {
                height:(width > 620)?'3vw':'10vw',
                width: (width > 620)?'3vw':'10vw',
                margin: (width > 620)?'0.5vw':'1vw'
            },
        arrowContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyItems: 'center',
            margin: 0
        },
        arrow: {
            height: (width > 620)?height*0.2:(width > 321)?height*0.25:height*0.15
        },
        arrowText: {
            margin: 0,
            lineHeight: '8px',
            fontSize: '12px',
            fontWeight: '500'
        }
    }
    return(
        <div style={profile}>
            {(window.innerWidth > 620) ? (null) : (
                    <h1 style={styles.nameText}>Brandon Gottshall</h1>
            )}
            <img style={styles.profileImage} alt="Brandon Gottshall" src={me} />

            <p style={styles.mission}>A motivated Software Engineer with a highly adaptable skill set acquired through the Marine Corps. Comfortable taking root, and finding success in uncomfortable and difficult situations. Extremely passionate about the tech industry, and always ready to embrace failure, growth, and to demand success.
                <br />
                <div style={styles.iconContainer}>
                    <a href='https://github.com/Brandon-Gottshall'><GithubIcon style={styles.icon}/></a>
                    <a href='https://www.linkedin.com/in/brandon-gottshall/'><LinkedInIcon style={styles.icon}/></a>
                </div>
            </p>
                <div style={styles.arrowContainer} onClick={()=>scrollSetter('.skills')}>
                    <p style={styles.arrowText}>{width>620?'Click':'Touch'}</p>
                    <Arrow
                        style={styles.arrow}/>
                </div>

        </div>
    )
}



// Projects / Work
// Summary of what you did
// Languages, frameworks & databases used
// Link to live project
// Link to your Git-Hub  (ReadMe’s need to be cleaned up and easy to understand!)
