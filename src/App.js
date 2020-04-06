import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import jump from 'jump.js'
//My Component Imports
import Divider from './components/shared/Divider'
import Profile from './components/Profile'
import Header from './components/Header'
import Skills from './components/Skills'
import Languages from './components/Languages'
import Form from './components/Form.js'
//SAASy imports
import './styles/styles.css'
import { red } from './services/colorPallete'
//Image Imports
import resume from './Resume.pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export default function App() {
    const [numPages, setNumPages] = useState(null)
    const onDocumentLoadSuccess = ({numPages}) => setNumPages(numPages)
    return (
        <div className='appContainer'>
            <Header/>
            <div className='contentScrollBox'>
                <br/>
                <Profile/>
                <Divider text='Skills' />
                <Skills/>
                <Divider text='Languages' />
                <Languages/>
                <br/>
                <Divider text='Resume' />
                <br/>
                <a
                    className='resumeContainer'
                    target='_blank'
                    href='https://www.gottshall.dev/Resume.pdf'>

                    <Document
                        className='pdf'
                        file={resume}
                        onLoadError={console.error}
                        onLoadSuccess={console.log('success')}>

                        <Page pageNumber={1} />

                    </Document>

                </a>
                    <Divider />
                    <br/>
                    <Form/>
                    <br/>

                </div>
        </div>
    )
}


// const widthSetter = (window.innerWidth > 620) ? ('80vw') : ('100vw')
// const resumeWidthSetter = (window.innerWidth > 620) ? ('60vw') : ('100vw')
// const resumeMarginSetter = (window.innerWidth > 620) ? ('20vw') : ('-9vw')
// const styles = {
//     appContainer: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         borderTop: `2vh solid ${red}`,
//         position: 'fixed',
//         width: '100vw',
//         top: '0',
//         left: '0'
//     },
//     contentScrollBox: {
//         display: 'block',
//         alignItems: 'center',
//         margin: '0',
//         height: '100vh',
//         width: widthSetter,
//         overflowY: 'scroll',
//         overflowX: 'hidden'
//     }
// }
