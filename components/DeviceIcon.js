import Image from 'next/image'
import { useEffect } from 'react'
import Tooltip from './Tooltip'
import webIcon from '../public/web.svg'
import desktopMobileIcon from '../public/desktop-mobile.svg'
import cloudIcon from '../public/cloud.svg'

export default function DeviceIcon ({ linkSafeguard, deviceIconStyle, deviceName, altText, tooltipText }) {
  useEffect(() => {
    console.log(`linkSafeguard : ${linkSafeguard}`)
  }, [linkSafeguard])
  const iconSelector = {
    web: webIcon,
    'desktop-mobile': desktopMobileIcon,
    cloud: cloudIcon
  }
  return (
    <Tooltip tooltipText={tooltipText}>
      <Image src={iconSelector[deviceName]} alt={altText} height={40} />
    </Tooltip>
  )
}
