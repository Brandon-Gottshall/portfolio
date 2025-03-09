export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light mb-8">About Me</h1>

        {/* Introduction Section */}
        <section className="mb-16">
          <p className="text-lg text-gray mb-6">
            I&apos;m Brandon Gottshall, a software engineer passionate about creating elegant solutions 
            to complex problems. With a focus on modern web technologies, I specialize in building 
            scalable, user-centric applications that make a difference.
          </p>
          <p className="text-lg text-gray">
            My journey in software development has been driven by a constant desire to learn 
            and grow, embracing new technologies while maintaining a strong foundation in 
            software engineering principles.
          </p>
        </section>

        {/* Philosophy Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6">My Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-navy/10">
              <h3 className="text-xl font-light mb-3">Clean Code</h3>
              <p className="text-gray">
                I believe in writing maintainable, well-documented code that solves real problems
                while being easy to understand and modify.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-navy/10">
              <h3 className="text-xl font-light mb-3">User-First</h3>
              <p className="text-gray">
                Every technical decision is made with the end user in mind, ensuring
                the best possible experience.
              </p>
            </div>
          </div>
        </section>

        {/* Interests Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6">Beyond Coding</h2>
          <div className="p-6 rounded-xl border border-navy/10">
            <p className="text-gray mb-4">
              When I&apos;m not coding, you&apos;ll find me:
            </p>
            <ul className="list-disc list-inside text-gray space-y-2">
              <li>Exploring new technologies and frameworks</li>
              <li>Contributing to open-source projects</li>
              <li>Writing technical blog posts</li>
              <li>Mentoring aspiring developers</li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="p-8 rounded-xl bg-navy/5 text-center">
            <h2 className="text-2xl font-light mb-4">Let&apos;s Connect</h2>
            <p className="text-gray mb-6">
              I&apos;m always open to discussing new projects, creative ideas, or
              opportunities to be part of your visions.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-navy text-cream hover:bg-red transition-colors duration-300 rounded-lg"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </div>
    </div>
  );
} 