import { Document, Page, pdfjs } from 'react-pdf'
import useWindowSize from '../util/useWindowSize'
import { useEffect, useRef, useState } from 'react'
// import dynamic from 'next/dynamic'
// import BouncingLink from './BouncingLink'
import BouncingArrow from './BouncingArrow'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export default function Resume ({
  pageNumber, linkSafeguard, setPageNumber, setLinkSafeguard, lockScroll
}) {
  const [pdfScrollYPos, setPdfScrollYPos] = useState(null)
  const [pdfScale, setPDFScale] = useState(1.2)
  const pdfContainerRef = useRef()
  const windowSize = useWindowSize()

  useEffect(() => {
    if (pageNumber === 2) {
      pdfScrollYPos >= 1
        ? lockScroll(true)
        : lockScroll(false)
    }
  }, [pdfScrollYPos])

  const onScroll = () => {
    setPdfScrollYPos(pdfContainerRef.current.scrollTop)
  }

  const openPage2 = async () => {
    setLinkSafeguard(false)
    setPageNumber(1)
    setTimeout(() => {
      setLinkSafeguard(true)
    }, 800)
  }

  return (
    <main className='flex flex-col items-center justify-between w-screen h-full px-2 text-center md:px-20'>
      <div className='flex items-center justify-start w-screen'>
        <div className='flex justify-end w-2/3'>
          <BouncingArrow contClassName='w-1/2 h-auto' helper={openPage2} direction='up' />
        </div>
        <div className='flex items-center justify-center w-1/3 h-auto py-6 space-x-4 sm:p-6'>
          <div className='w-10 h-10 text-4xl text-center text-white rounded-sm select-none nm-convex-black-xs' onClick={() => setPDFScale(pdfScale - 0.1)}>-</div>
          <div className='w-10 h-10 text-3xl text-center rounded-sm select-none nm-convex-gray-300-xs' onClick={() => setPDFScale(pdfScale + 0.1)}>+</div>
        </div>
      </div>
      <div className='flex items-start justify-center flex-grow w-screen overflow-y-auto nm-convex-gray-300-lg' ref={pdfContainerRef} onScroll={onScroll}>
        <Document file='./resume.pdf' className='flex flex-col items-center justify-center flex-grow overflow-y-auto width-full'>
          <a href='resume.pdf' download='BrandonGottshallResume' className='p-2 mt-12 text-2xl text-white rounded-sm text-thin nm-convex-red-500-xs nm-convex-red'>Download</a>
          <Page
            style={{ width: '80%', height: '100%' }}
            className='my-10'
            scale={windowSize.width / 1000 * pdfScale}
            key='page_1'
            pageNumber={1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
          <a href='resume.pdf' download='BrandonGottshallResume' className='p-2 mb-12 text-2xl text-white rounded-sm text-thin nm-convex-red-500-xs nm-convex-red'>Download</a>
        </Document>
      </div>
    </main>
  )
}
