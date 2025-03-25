export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Main heading with elegant light weight and tight tracking */}
        <h1 className="text-4xl font-light mb-8 tracking-tight text-navy dark:text-cream">
          About Me
        </h1>

        {/* Introduction Section - using regular weight for better readability */}
        <section className="mb-16">
          <p className="text-lg text-gray mb-6 leading-relaxed">
            I&apos;m Brandon Gottshall, a{' '}
            <span className="font-code">software engineer</span> passionate
            about creating elegant solutions to complex problems. With a focus
            on <span className="font-code">modern web technologies</span>, I
            specialize in building scalable, user-centric applications that make
            a difference.
          </p>
          <p className="text-lg text-gray leading-relaxed">
            My journey in software development has been driven by a constant
            desire to learn and grow, embracing new technologies while
            maintaining a strong foundation in software engineering principles.
          </p>
        </section>

        {/* Philosophy Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6 tracking-tight text-navy dark:text-cream">
            My Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-navy/10 dark:border-cream/10">
              <h3 className="text-xl font-light mb-3 text-navy dark:text-cream">
                <span className="font-code">Clean Code</span>
              </h3>
              <p className="text-gray dark:text-tan">
                I believe in writing maintainable, well-documented code that
                solves real problems while being easy to understand and modify.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-navy/10 dark:border-cream/10">
              <h3 className="text-xl font-light mb-3 text-navy dark:text-cream">
                User-First
              </h3>
              <p className="text-gray dark:text-tan">
                Every technical decision is made with the end user in mind,
                ensuring the best possible experience.
              </p>
            </div>
          </div>
        </section>

        {/* Interests Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6 tracking-tight text-navy dark:text-cream">
            Beyond Coding
          </h2>
          <div className="p-6 rounded-xl border border-navy/10 dark:border-cream/10">
            <p className="text-gray dark:text-tan mb-4">
              When I&apos;m not coding, you&apos;ll find me:
            </p>
            <ul className="list-disc list-inside text-gray dark:text-tan space-y-2">
              <li>
                Exploring new <span className="font-code">technologies</span>{' '}
                and <span className="font-code">frameworks</span>
              </li>
              <li>
                Contributing to <span className="font-code">open-source</span>{' '}
                projects
              </li>
              <li>Writing technical blog posts</li>
              <li>Mentoring aspiring developers</li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="p-8 rounded-xl bg-navy/5 dark:bg-navy text-center">
            <h2 className="text-2xl font-light mb-4 tracking-tight text-navy dark:text-cream">
              Let&apos;s Connect
            </h2>
            <p className="text-gray dark:text-tan mb-6">
              I&apos;m always open to discussing new projects, creative ideas,
              or opportunities to be part of your visions.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-navy text-cream hover:bg-red transition-colors duration-300 rounded-lg font-medium"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
