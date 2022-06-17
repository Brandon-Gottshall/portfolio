import { Document, Page, pdfjs } from 'react-pdf'
import useWindowSize from '../util/useWindowSize'
import { useState } from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export default function Resume () {
  const [pdfScale, setPDFScale] = useState(1.2)
  const windowSize = useWindowSize()
  return (
    <main className='flex flex-col items-center justify-between w-screen h-full px-2 text-center md:px-20'>
      <h3
        className='text-2xl font-thin text-red-500 translate-x-0 transform-gpu sm:text-3xl animate-fade-in-from-left'
      >Resume
      </h3>
      <div className='flex items-start justify-center flex-grow w-screen overflow-y-auto'>
        <Document file='./resume.pdf' className='flex flex-col items-center justify-center flex-grow overflow-y-auto width-full'>
          <div className='flex items-center justify-between w-full mt-12 mb-6'>
            <div className='w-1/2 '>
              <a
                href='resume.pdf' download="Brandon Gottshall\'s Resume"
                className='w-32 px-6 py-3 mt-12 text-lg text-white rounded-sm text-thin nm-convex-red-500-xs nm-convex-red'
              >
                Download
              </a>
            </div>
            <div className='flex items-center justify-center w-1/2 space-x-4 sm:p-6'>
              <div className='w-10 h-auto text-4xl text-center rounded-lg select-none nm-convex-gray-300-xs' onClick={() => setPDFScale(pdfScale - 0.1)}>-</div>
              <div
                className='w-10 h-auto text-3xl text-center rounded-sm select-none nm-convex-gray-300-xs' onClick={() => setPDFScale(
                  pdfScale > 1.6 ? pdfScale : pdfScale + 0.1
                )}
              >+
              </div>
            </div>
          </div>
          <Page
            style={{ width: '80%', height: '100%' }}
            className='mb-10 border-8 border-gray-600 rounded-lg'
            scale={windowSize.width / 1000 * pdfScale}
            key='page_1'
            pageNumber={1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
          {/*
        // TODO  Change Resume Projects blurb "Links available on my personal site"
        // TODO  **Maybe** make text selectable and copyable
        // TODO  **Maybe** make text clickable and open in new tab
      */}
          <div className='flex items-center justify-center w-full mb-12 h-1/12'>
            <a
              href='resume.pdf' download="Brandon Gottshall\'s Resume"
              className='w-32 px-6 py-3 text-lg text-white rounded-sm mb-18 text-thin nm-convex-red-500-xs nm-convex-red'
            >
              Download
            </a>
          </div>
        </Document>
      </div>
    </main>
  )
}
