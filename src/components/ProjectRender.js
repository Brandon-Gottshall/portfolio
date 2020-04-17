
import React, { useState } from 'react'
//Color Imports
import { red } from '../services/colorPallete'
//Image Imports
import crimeNY from '../images/crime-ny.png'
import question from '../images/sei-trivia/question.png'
//Icon imports
import { ReactIcon,
         ReactNativeIcon,
         ExpressIcon,
         JSIcon,
         RubyIcon,
         RailsIcon,
         PostgreIcon,
         CSSIcon,
         HTMLIcon,
        GithubIcon} from '../services/svgHelper'

export default function ProjectRender({id}) {
    const [ previewName, setPreviewName ] = useState(null)
    const styles = {
        galleryView: {
            display: 'grid',
            gridTemplateColumns: '33% 33% 33%',
            gridTemplateRows: '50% 50%',
            height: '400px',
            width: '100%',
            margin: '2vw',
            marginTop: '10vh'
        },
        galleryViewNone: {
            display: 'none'
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '5vh',
            width: '15vw',
            height: '20vw'
        },
        project: {
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            margin: 'auto',
            width: '14vw',
            height: '14vw',
        },
        title: {
            fontSize: '1.2vw',
            fontWeight: '600'
        },
        languageContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            width: '10vw',
            alignItems: 'flex-start',
            justifyContent: 'center'
        },
        languageIcon: {
            width: '2vw',
            height: '2vw',
            marginTop: '1vh',
            marginRight: '5px'
        },
        preview: {
            width: '80vw',
            height: '40vh',
            backgroundColor: 'blue'
        },
        previewNone: {
            display: 'none'
        }
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

    const languages = ['Pick an icon to see projects I\'ve written in that language.', 'React', 'React Native', 'JavaScript', 'Express', 'Ruby', 'Ruby on Rails', 'Postgre SQL', 'HTML', 'CSS']
    const icons = [
        <ReactIcon          style={styles.languageIcon}/>,
        <ReactNativeIcon    style={styles.languageIcon}/>,
        <ExpressIcon        style={styles.languageIcon}/>,
        <RailsIcon          style={styles.languageIcon}/>,
        <PostgreIcon        style={styles.languageIcon}/>,
        <RubyIcon           style={styles.languageIcon}/>,
        <JSIcon             style={styles.languageIcon}/>,
        <HTMLIcon           style={styles.languageIcon}/>,
        <CSSIcon            style={styles.languageIcon}/>,
    ]

    const styleHelper = () => (id==0) ? styles.galleryViewNone:styles.galleryView

    return (
        <div style={{display:'flex', flexDirection:'column'}} >
            <h4 style={{margins:'0'}}>{
                languages[id]
            }</h4>
        <div style={styleHelper()}>
                {projects.map(({name, languageIds, preview}, index) => {
                    if (index < 3) {
                        return (
                            languageIds.includes(id) ?
                            <div style={styles.container} key={index} onClick={()=>setPreviewName(name)}>
                            <div style={styles.project}>
                            <img alt='preview of project' stlye={{width: '100%', height: '100%'}} src={preview} />
                            </div>
                            <h3 style={styles.title}>{name}
                                <a href='https://github.com/Brandon-Gottshall/Crime-NY'>
                                    <GithubIcon height='1vw' width='1vw'/>
                                </a>
                            </h3>
                            <div style={styles.languageContainer}>
                            {
                                languageIds.map(language => {
                                    return icons[language-1]
                                })
                            }
                            </div>
                            </div>
                            : null
                        )}})
                    }
            </div>
        </div>
    )
}
