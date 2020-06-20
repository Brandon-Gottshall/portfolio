import React, { useState } from 'react'
import SkillsContent from './SkillsContent'
//Color Imports
import { red } from '../services/colorPallete'
//Icon imports
import { FaBrain, FaHandshake, FaPeopleCarry } from 'react-icons/fa'
import { IoIosBowtie } from "react-icons/io"

export default function Skills({width}) {
    const iconSwitcher = {
        icon: 'w-10 small: w-8 h-10 small: h-8',
        iconActive: 'w-12 small: w-10 h-12 small: h-10 text-red-def',
    }

    const [ growth, setGrowth ] = useState(iconSwitcher.icon)
    const [ responsibility, setResponsibility ] = useState(iconSwitcher.icon)
    const [ teamwork, setTeamwork ] = useState(iconSwitcher.icon)
    const [ profesionalism, setProfesionalism ] = useState(iconSwitcher.icon)
    const [ activeId, setActiveId ] = useState(0)
    const clickHelper = (id) => {
        (id == activeId) ? setActiveId(0) : setActiveId(id)
        console.log(width)
    }
    return(
        <div>
            <div className="flex items-center justify-around h-16 mb-1">
                <FaBrain
                    className={growth}
                    onMouseEnter={() => setGrowth(iconSwitcher.iconActive)}
                    onMouseLeave={() => setGrowth(iconSwitcher.icon)}
                    onClick={() => clickHelper(1)}
                    viewBox='0 0 640 490'
                />
                <FaHandshake
                    className={responsibility}
                    onMouseEnter={() => setResponsibility(iconSwitcher.iconActive)}
                    onMouseLeave={() => setResponsibility(iconSwitcher.icon)}
                    onClick={() => clickHelper(2)}
                />
                <FaPeopleCarry
                    className={teamwork}
                    onMouseEnter={() => setTeamwork(iconSwitcher.iconActive)}
                    onMouseLeave={() => setTeamwork(iconSwitcher.icon)}
                    onClick={() => clickHelper(3)}
                />
                <IoIosBowtie
                    className={profesionalism}
                    onMouseEnter={() => setProfesionalism(iconSwitcher.iconActive)}
                    onMouseLeave={() => setProfesionalism(iconSwitcher.icon)}
                    onClick={() => clickHelper(4)}
                />
            </div>
            <div className="text-center">
                <SkillsContent activeId={activeId} />
            </div>
        </div>
    )
}
