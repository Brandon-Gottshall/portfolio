import React from 'react'
// Image imports
import me from '../images/me.png'
// Icon imports
import { GithubIcon, LinkedInIcon } from '../services/svgHelper'
import { Arrow } from '../services/svgHelper.js'


export default function Profile({width, height, scrollSetter}) {
    return(
        <div className="flex flex-col items-center content-center m-auto h-screen">
            <h1 className="font-bebas text-5xl sm:hidden">Brandon Gottshall</h1>
            <img className="w-40 rounded border-2 border-red-def mb-8" alt="Brandon Gottshall" src={me} />

            <p className="w-4/5 text-center text-xl sm:text-lg">A motivated Software Engineer with a highly adaptable skill set acquired through the Marine Corps. Comfortable taking root, and finding success in uncomfortable and difficult situations. Extremely passionate about the tech industry, and always ready to embrace failure, grow with my team, and to demand success.
                <br />
                <div className="h-24 flex justify-center items-center mt-6 mb-6">
                    <a href='https://github.com/Brandon-Gottshall'><GithubIcon className="h-12 w-12 mr-12"/></a>
                    <a href='https://www.linkedin.com/in/brandon-gottshall/'><LinkedInIcon className="h-12 w-12 m-1"/></a>
                </div>
            </p>
                <div className="flex justify-center" onClick={()=>scrollSetter('.skills')}>
                    <Arrow className="h-56 sm:hidden"/>
                </div>

        </div>
    )
}
