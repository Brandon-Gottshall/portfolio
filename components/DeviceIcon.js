import Image from 'next/image'
import Tooltip from './Tooltip'
import webIcon from '../public/web.svg'
import desktopMobileIcon from '../public/desktop-mobile.svg'
import cloudIcon from '../public/cloud.svg'

export default function DeviceIcon({deviceIconStyle, deviceName, altText, tooltipText}) {
    const iconSelector = {
        'web': webIcon,
        'desktop-mobile': desktopMobileIcon,
        'cloud': cloudIcon
    }
    return ( 
        <Tooltip tooltipText={tooltipText} >
            <Image src={iconSelector[deviceName]} alt={altText} width={75} height={75} />
        </Tooltip>
    )
}