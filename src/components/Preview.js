import React from 'react'
//Image import
import crimeNY from '../images/crime-ny.png'
//Icon imports
import { GithubIcon, LinkedInIcon } from '../services/svgHelper'

export default function Preview({name, setPreviewName}) {
const styles = {
    preview: {
        width: '70vw',
        height: '50vh',
        margin: '2vw',
        marginBottom: '5vh',
        paddingLeft: '2vw',
        textAlign: 'left',
        border: '.2vw solid black'
    },
    previewNone: {
        display: 'none',
        margin: '2vw',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        gridTemplateRows: '100%',
    }
}
const render = () => {
    switch (name) {
        case 'Crime NY':
        return (
            <div style={styles.grid}>
                <div>
                    <h1>Crime NY</h1>
                <img src={crimeNY}/>
                </div>
                <div>
                    <p>This application provides a historical experience to the end-user of the ever changing climate of crime in NYC.</p>
                    <a href='https://github.com/Brandon-Gottshall/Crime-NY'>
                    <GithubIcon height='3vw' width='3vw'/>
                    </a>
                    <a href='https://crime-ny.surge.sh'>

                    </a>
                </div>
            </div>
        )
        default:
        return <p>{name}</p>

    }
}
const styleHelper = () => (name == null) ? styles.previewNone:styles.preview
    return (
        <div style={styleHelper()} >
            {render()}
        </div>
    )
}
