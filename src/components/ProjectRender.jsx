import React, { useState, useEffect } from 'react'
import ReactCardFlip from 'react-card-flip'
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

export default function ProjectRender({id, width}) {
    const [ previewName, setPreviewName ] = useState(null)
    const [ project1, setProject1 ] = useState(true)
    const [ project2, setProject2 ] = useState(false)
    const [ project3, setProject3 ] = useState(false)
    const [activeProject, setActiveProject] = useState([true, false, false, false])
    const projectChecker = (id) => {
        switch (id) {
            case 1:
                return project1
            case 2:
                return project2
            case 3:
                return project3
            default:

        }
    }
    const handleMouseOver = (id) => {
        setActiveProject(activeProject.map((el, index)=>{
            el = (index===id+1)?true:false
            return el
        }))
    }
    const handleMouseOut = (id) => {
        switch (id) {
            case 1:
                setProject1(false)
                break
            case 2:
                setProject2(false)
                break
            case 3:
                setProject3(false)
                break
            default:
                return
    }}
    useEffect(()=>{
        setProject1(activeProject[1])
        setProject2(activeProject[2])
        setProject3(activeProject[3])
    },[activeProject])
    const styles = {
        galleryView: {
            display: 'grid',
            gridTemplateColumns: (width>620)?'33% 33% 33%':'100%',
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
            height: '15vw'
        },
        project: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            width: '215px',
            height: '215px',
            borderRadius: '15px',
            backgroundColor: 'gray'
        },
        descriptionContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            width: '215px',
            height: '215px',
            borderRadius: '15px',
            backgroundColor: 'gray',
        },
        descriptionAnchor: {
            width: width*0.05,
            height: width*0.05
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
            justifyContent: 'center',
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
            description: 'A visualization of the ever changing fingerprint of NYC crime. Utilizes Mapbox and the NYC OpenData API',
            languageIds: [1, 3, 5, 7, 8, 9],
            gitHub: '',
            link: '',
            preview: crimeNY
        },
        {
            name:'SEI Trivia',
            id: 2,
            description: 'A native Trivia Game ',
            languageIds: [1, 2, 4, 5, 6, 7, 8, 9],
            gitHub: '',
            link: '',
            preview: question
        },
        {
            name:'Simple Macro Tracker',
            id: 3,
            description: '',
            languageIds: [7, 8, 9],
            gitHub: '',
            link: '',
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
    const cardGenerator = (id) => { return(
        <div style={styles.container}
        onMouseEnter={()=>handleMouseOver(id-1)} onMouseLeave={()=>handleMouseOut(id)}>
            <ReactCardFlip isFlipped={(id===1)?project1:(id===2)?project2:project3} flipDirection="horizontal" key={id} >
                <div style={styles.project}>
                    <img alt='preview of project' stlye={{width: '100%', height: '100%'}} src={projects[id-1].preview} />
                </div>
                <div style={styles.descriptionContainer}>
                    <p>{projects[id-1].description}</p>
                    <a style={styles.descriptionAnchor} target='_blank' rel='noopener noreferrer' href='https://github.com/Brandon-Gottshall/Crime-NY'>
                        <GithubIcon height='100%' width='100%'/>
                    </a>
                </div>
            </ReactCardFlip>
            <h3 style={styles.title}>{projects[id-1].name}
            </h3>
            <div style={styles.languageContainer}>
            {
                projects[id-1].languageIds.map(language => {
                    return icons[language-1]
                })
            }
            </div>
        </div>
    )}

    return (
        <div style={{display:'flex', flexDirection:'column'}} >
            <h4 style={{margin:'0'}}>{
                languages[id]
            }</h4>
        <div style={styleHelper()}>
            {(projects[0].languageIds.includes(id))?cardGenerator(1):null}
            {(projects[1].languageIds.includes(id))?cardGenerator(2):null}
            {(projects[2].languageIds.includes(id))?cardGenerator(3):null}

            </div>
        </div>
    )
}
