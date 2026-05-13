import { Mail, Linkedin, Github } from 'lucide-react'

export const metadata = {
  title: 'Contact',
  description:
    'Contact Brandon Gottshall about workflow-heavy tools, learning systems, structured content pipelines, and maintainable internal software.'
}

export default function ContactPage() {
  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='mx-auto max-w-2xl text-center'>
        <p className='font-code text-sm font-semibold uppercase tracking-[0.28em] text-red'>
          Contact
        </p>
        <h1 className='mt-3 text-4xl font-light tracking-tight text-navy dark:text-cream sm:text-5xl'>
          Start with the work that needs a clear handoff.
        </h1>
        <p className='mt-4 text-lg leading-8 text-gray-dark dark:text-tan'>
          Best fit: practical software, learning tools, structured content
          pipelines, and internal systems where maintainability matters. Email
          is the fastest channel.
        </p>
      </div>

      <div className='mx-auto mt-12 grid max-w-2xl gap-4'>
        <a
          href='mailto:blgottshall@gmail.com'
          className='group flex items-center gap-4 rounded-2xl border border-navy/15 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-md dark:border-cream/20 dark:bg-navy-light/40 dark:hover:border-cream/40'
        >
          <Mail className='w-6 h-6 text-navy dark:text-cream group-hover:text-red transition-colors' />
          <div className='text-left'>
            <h2 className='text-lg font-medium tracking-tight text-navy dark:text-cream'>
              Email
            </h2>
            <p className='font-code text-sm text-gray-dark dark:text-tan'>
              Fastest for project fit and availability.
            </p>
          </div>
        </a>

        <a
          href='https://linkedin.com/in/brandon-gottshall'
          target='_blank'
          rel='noopener noreferrer'
          className='group flex items-center gap-4 rounded-2xl border border-navy/15 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-md dark:border-cream/20 dark:bg-navy-light/40 dark:hover:border-cream/40'
          aria-label='Visit my LinkedIn profile'
        >
          <Linkedin className='w-6 h-6 text-navy dark:text-cream group-hover:text-red transition-colors' />
          <div className='text-left'>
            <h2 className='text-lg font-medium tracking-tight text-navy dark:text-cream'>
              LinkedIn
            </h2>
            <p className='text-sm text-gray-dark dark:text-tan'>
              Useful for professional context and asynchronous intros.
            </p>
          </div>
        </a>

        <a
          href='https://github.com/Brandon-Gottshall'
          target='_blank'
          rel='noopener noreferrer'
          className='group flex items-center gap-4 rounded-2xl border border-navy/15 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-md dark:border-cream/20 dark:bg-navy-light/40 dark:hover:border-cream/40'
          aria-label='View GitHub repositories'
        >
          <Github className='w-6 h-6 text-navy dark:text-cream group-hover:text-red transition-colors' />
          <div className='text-left'>
            <h2 className='text-lg font-medium tracking-tight text-navy dark:text-cream'>
              GitHub
            </h2>
            <p className='text-sm text-gray-dark dark:text-tan'>
              Public repositories, docs, and project history.
            </p>
          </div>
        </a>
      </div>
    </div>
  )
}
