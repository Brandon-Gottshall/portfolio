import React from 'react'

//Color Imports
import { red } from '../services/colorPallete'

export default function Profile() {
    const profile = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '10vh'
    }
    return(
        <div style={profile}>
            <img style={{maxWidth: '15vw', borderRadius: '50%', border: '.5vw solid black'}} src='https://placekitten.com/200/300'/>

            <p style={{maxWidth: '40vw', marginBelow: '5vh'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta eros eget elementum sagittis. Proin at magna imperdiet, suscipit tellus vel, pellentesque diam. Maecenas vitae sem aliquam, fermentum leo eget, porta justo..</p>

        </div>

    )
}
