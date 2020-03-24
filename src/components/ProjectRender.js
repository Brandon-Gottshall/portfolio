import React from 'react'
//Color Imports
import { red } from '../services/colorPallete'
//Image Imports
import crimeNY from '../images/crime-ny.png'
import mactrack from '../images/mactrack.png'
import question from '../images/sei-trivia/question.png'
//Icon imports
import { GithubIcon} from '../services/svgHelper'

export default function ProjectRender() {
    const styles= {
        galleryView: {
            display: 'grid',
            gridTemplateColumns: '50% 50%',
            gridTemplateRows: '50% 50%',
            width: '100%',
            margin: '20px'
        },
        project: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            margin: '6vw',
            width: '35vh',
            height: '35vh',
        },
        linkContainer: {
            display: 'flex',
            alignItems: 'center',
            width: '80px',
         },
        link: {
            width: '40px',
            margin: '0',
            marginBelow: '2vh',
            color: red
        },
        iconStyle: {
            height:'30px',
             width:'40px'
        }
    }
    return(
        <div style={styles.galleryView}>
            <div style={styles.project}>
                <h4>Crime NY</h4>
                <img src={crimeNY}/>
                <p>A visual experiment showing the everchanging fingerprint of NYC crime.
                </p>
                    <div style={styles.linkContainer}>
                        <a style={styles.link}><GithubIcon style={styles.iconStyle} /></a>
                    <a href='http://www.crime-ny.surge.sh' style={styles.link}>Preview</a>
                    </div>
            </div>
            <div style={styles.project}>
                <h4>SEI Trivia</h4>
                <img src={question}/>
                <p>A mobile trivia game built to aid students at General Assembly.</p>
                <div style={styles.linkContainer}>
                    <a style={styles.link}><GithubIcon style={styles.iconStyle} /></a>
                    <a style={styles.link}>Preview</a>
                </div>
            </div>
            <div style={styles.project}>
                <h4>Simple Macro Tracker</h4>
                <img src={mactrack}/>
                <p>An application created to help users track their daily consumed food and work towards macro-nutrient goals.</p>
                <div style={styles.linkContainer}>
                    <a style={styles.link}><GithubIcon style={styles.iconStyle} /></a>
                    <a href='https://gottshall.dev/smt/index.html' style={styles.link}>Preview</a>
                </div>
            </div>
        </div>
    )
}
const projects = [
    {
        name:'Crime NY',
        id: 1,
        description: '',
        languageIds: [1, 3, 5, 7, 8, 9],
        gitHub: '',
        preview: crimeNY
    },
    {
        name:'SEI Trivia',
        id: 2,
        description: '',
        languageIds: [1, 2, 4, 5, 6, 7, 8, 9],
        gitHub: '',
        preview: question
    },
    {
        name:'Simple Macro Tracker',
        id: 3,
        description: '',
        languageIds: [7, 8, 9],
        gitHub: '',
        preview: ''
    }
]
