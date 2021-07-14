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
    <main className='flex flex-col items-center justify-between w-full h-full px-20 text-center'>
      <div className='flex items-center justify-center w-screen h-4 py-8'>
        <BouncingArrow helper={openPage2} direction='up' />
      </div>
      <div className='flex items-start justify-center flex-grow mb-2 overflow-y-auto' ref={pdfContainerRef} onScroll={onScroll}>
        <Document file='./resume.pdf'>
          <Page
            style={{ width: '80%', height: '100%' }}
            scale={windowSize.width / 1000 * 1.65}
            key='page_1'
            pageNumber={1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </div>
    </main>
  )
}
