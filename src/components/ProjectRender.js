
import React from 'react'
//Color Imports
import { red } from '../services/colorPallete'
//Image Imports
import crimeNY from '../images/crime-ny.png'
//Icon imports
import { ReactIcon,
         ReactNativeIcon,
         ExpressIcon,
         JSIcon,
         RubyIcon,
         RailsIcon,
         PostgreIcon,
         CSSIcon,
         HTMLIcon     } from '../services/svgHelper'

export default function ProjectRender({id}) {
    const styles = {
        galleryView: {
            display: 'grid',
            gridTemplateColumns: '33% 33% 33%',
            gridTemplateRows: '50% 50%',
            height: '40vw',
            width: '100%'
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
            border: `.1vw solid ${red}`
        },
        title: {
            fontSize: '1.2vw',
            fontWeight: '600'
        },
        languageContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        },
        languageIcon: {
            width: '2vw',
            height: '2vw'
        }
    }
    const projects = [
        {
            name:'Crime NY',
            id: 0,
            description: '',
            languageIds: [1, 3, 5, 7, 8, 9],
            gitHub: '',
            preview: crimeNY
        },
        {
            name:'SEI Trivia',
            id: 1,
            description: '',
            languageIds: [1, 2, 4, 5, 6, 7, 8, 9],
            gitHub: '',
            preview: ''
        },
        {
            name:'Simple Macro Tracker',
            id: 2,
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
        <>
            <h4>{
                languages[id]
            }</h4>
        <div style={styleHelper()}>
                {projects.map(({name, languageIds, preview}) => {
                    return (
                        languageIds.includes(id) ?
                            <div style={styles.container} key={id}>
                                <div style={styles.project}>
                                    <img stlye={{width: '100%', height: '100%'}} src={preview} />
                                </div>
                                <h3 style={styles.title}>{name}</h3>
                            <div style={styles.languageContainer}>
                                {
                                    languageIds.map(language => {
                                        return icons[language-1]
                                    })
                                }
                            </div>
                            </div>
                            : null
                    )})}
            </div>
        </>
    )
}
