
import React from 'react'

//Color Imports
import { red } from '../services/colorPallete'
// Image imports
import me from '../images/me.png'

export default function Profile() {
    const profile = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '1vh'
    }
    return(
        <div style={profile}>
            <img style={{maxWidth: '10vw', borderRadius: '50%', border: `.1vw solid black`, marginRight: '0', marginLeft: '5vw'}} src={me} />

        <p style={{maxWidth: '45vw', marginBelow: '5vh', marginLeft: '5vw'}}>A motivated Software Engineer with a highly adaptable skill set acquired through the Marine Corps. Comfortable taking root, and finding success in uncomfortable and difficult situations. Extremely passionate about the tech industry, and always ready to embrace failure, growth, and to demand success.</p>

        </div>

    )
}


// Projects / Work
// Summary of what you did
// Languages, frameworks & databases used
// Link to live project
// Link to your Git-Hub  (ReadMe’s need to be cleaned up and easy to understand!)
