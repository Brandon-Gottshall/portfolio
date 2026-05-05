import { AnimatedSection } from '@/components/AnimatedSection'

export default function AboutPage() {
  return (
    <div className='container px-4 py-16 mx-auto'>
      <div className='mx-auto max-w-4xl'>
        <AnimatedSection>
          {/* Main heading with elegant light weight and tight tracking */}
          <h1 className='mb-8 text-4xl font-light tracking-tight text-navy dark:text-cream'>
            About Me
          </h1>

          {/* Introduction Section - using regular weight for better readability */}
          <section className='mb-16'>
            <p className='mb-6 text-lg leading-relaxed text-gray'>
              I&apos;m Brandon Gottshall, a{' '}
              <span className='font-code'>software engineer</span> passionate
              about creating elegant solutions to complex problems. With a focus
              on <span className='font-code'>modern web technologies</span>, I
              specialize in building scalable, user-centric applications that
              make a difference.
            </p>
            <p className='text-lg leading-relaxed text-gray'>
              My journey in software development has been driven by a constant
              desire to learn and grow, embracing new technologies while
              maintaining a strong foundation in software engineering
              principles.
            </p>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          {/* Philosophy Section */}
          <section className='mb-16'>
            <h2 className='mb-6 text-2xl font-light tracking-tight text-navy dark:text-cream'>
              My Philosophy
            </h2>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              <div className='p-6 rounded-xl border transition-shadow border-navy/10 dark:border-cream/10 hover:shadow-md'>
                <h3 className='mb-3 text-xl font-light text-navy dark:text-cream'>
                  <span className='font-code'>Clean Code</span>
                </h3>
                <p className='text-gray dark:text-tan'>
                  I believe in writing maintainable, well-documented code that
                  solves real problems while being easy to understand and
                  modify.
                </p>
              </div>
              <div className='p-6 rounded-xl border transition-shadow border-navy/10 dark:border-cream/10 hover:shadow-md'>
                <h3 className='mb-3 text-xl font-light text-navy dark:text-cream'>
                  User-First
                </h3>
                <p className='text-gray dark:text-tan'>
                  Every technical decision is made with the end user in mind,
                  ensuring the best possible experience.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.6}>
          {/* Interests Section */}
          <section className='mb-16'>
            <h2 className='mb-6 text-2xl font-light tracking-tight text-navy dark:text-cream'>
              Beyond Coding
            </h2>
            <div className='p-6 rounded-xl border transition-shadow border-navy/10 dark:border-cream/10 hover:shadow-md'>
              <p className='mb-4 text-gray dark:text-tan'>
                When I&apos;m not coding, you&apos;ll find me:
              </p>
              <ul className='space-y-2 list-disc list-inside text-gray dark:text-tan'>
                <li>
                  Exploring new <span className='font-code'>technologies</span>{' '}
                  and <span className='font-code'>frameworks</span>
                </li>
                <li>
                  Contributing to <span className='font-code'>open-source</span>{' '}
                  projects
                </li>
                <li>Writing technical blog posts</li>
                <li>Mentoring aspiring developers</li>
              </ul>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.9}>
          {/* Call to Action */}
          <section>
            <div className='p-8 text-center rounded-xl transition-all bg-navy/5 dark:bg-navy hover:bg-navy/10 dark:hover:bg-navy-light'>
              <h2 className='mb-4 text-2xl font-light tracking-tight text-navy dark:text-cream'>
                Let&apos;s Connect
              </h2>
              <p className='mb-6 text-gray dark:text-tan'>
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your visions.
              </p>
              <a
                href='/contact'
                className='inline-block px-6 py-3 font-medium rounded-lg transition-colors duration-300 transform bg-navy text-cream hover:bg-red hover:scale-105'
              >
                Get in Touch
              </a>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </div>
  )
}
