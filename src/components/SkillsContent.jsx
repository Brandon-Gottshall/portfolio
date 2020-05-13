import React from 'react'

export default function SkillsContent({activeId}) {
      switch (activeId) {
          case 1:
              return (
                  <>
                      <h4>Growth Mindset</h4>

                      <p>I embrace failure as a chance to learn and pivot. I often create goals beyond my current ability, as I know that is the best way to improve my skills.</p>
                  </>
              )
          case 2:
              return (
                  <>
                      <h4>Responsibility</h4>

                      <p>During my time in the Marine
                      Corps I was given the responsibility of managing maintenance on over $7,000,000 worth of equipment. I grew with this role, researching and asking constant questions to improve my effectiveness within the role and maintain equipment readiness.</p>
                  </>
              )
          case 3:
              return (
                  <>
                      <h4>Teamwork</h4>

                      <p>I've been part of many teams in my adult life but one of the most enjoyable instances was during my time at General Assembly. In a team of three developers, we collaborated with the UX design team to create a reworked version of booking.com with easier accessibility and eco-friendly features.  </p>
                  </>
              )
          case 4:
              return (
                  <>
                      <h4>Profesionalism</h4>
                      <p>As an assistant maintenance chief, I was often required to talk to other Marines with much higher rank and pay-grade. I learned to conduct myself with respect and professionalism in the workplace.</p>
                  </>
              )
          default:
              return (
                  <h4>Pick an icon explore my skills.</h4>
              )

      }
}
