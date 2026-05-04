import timeline from '../data/projectTimeline.json'

const statusStyles = {
  'active system': 'bg-red-500 text-white',
  'shipped rebuild': 'bg-black text-white',
  'focused utility': 'bg-gray-900 text-white',
  'preserved original': 'bg-white text-red-500 border border-red-500',
  'historical artifact': 'bg-white text-gray-700 border border-gray-300'
}

function LinkList ({ links }) {
  return (
    <div className='flex flex-wrap gap-3 pt-5'>
      {links.map((link) => (
        <a
          key={link.href}
          className='px-4 py-2 text-sm font-bold text-red-500 transition duration-300 rounded nm-flat-white-sm hover:text-white hover:bg-red-500 font-ox'
          href={link.href}
          target='_blank'
          rel='noopener noreferrer'
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

function TimelineCard ({ project, index }) {
  const statusClass = statusStyles[project.status] || statusStyles['historical artifact']
  return (
    <article className='relative grid gap-4 p-6 overflow-hidden bg-white rounded-lg nm-flat-white-lg sm:grid-cols-3'>
      <div className='absolute top-0 left-0 w-2 h-full bg-red-500' />
      <div className='pl-2'>
        <p className='text-sm font-bold tracking-widest text-gray-500 uppercase font-ox'>
          {project.period}
        </p>
        <h2 className='pt-2 text-3xl font-bold text-red-500 font-ox'>
          {project.title}
        </h2>
        <p className='pt-2 text-sm font-bold text-gray-700'>
          {project.lane}
        </p>
        <span className={`inline-flex px-3 py-1 mt-4 text-xs font-bold tracking-wide uppercase rounded-full font-ox ${statusClass}`}>
          {project.status}
        </span>
      </div>
      <div className='sm:col-span-2'>
        <p className='text-lg font-semibold leading-7 text-gray-900'>
          {project.summary}
        </p>
        <div className='grid gap-4 pt-5 sm:grid-cols-2'>
          <div>
            <h3 className='text-xs font-bold tracking-widest text-red-500 uppercase font-ox'>
              Why it stays
            </h3>
            <p className='pt-2 text-sm leading-6 text-gray-700'>
              {project.whyItMatters}
            </p>
          </div>
          <div>
            <h3 className='text-xs font-bold tracking-widest text-red-500 uppercase font-ox'>
              Intent
            </h3>
            <p className='pt-2 text-sm leading-6 text-gray-700'>
              {project.intent}
            </p>
          </div>
        </div>
        <div className='flex flex-wrap gap-2 pt-5'>
          {project.tags.map((tag) => (
            <span
              className='px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full'
              key={`${project.title}-${tag}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <LinkList links={project.links} />
      </div>
      <div className='absolute text-6xl font-black text-red-100 -right-1 -bottom-4 font-ox'>
        {String(index + 1).padStart(2, '0')}
      </div>
    </article>
  )
}

export default function ChronologicalFeed () {
  return (
    <section className='w-full px-5 pt-8 pb-16 sm:px-10'>
      <div className='w-full max-w-6xl mx-auto'>
        <div className='p-6 mb-8 bg-white rounded-lg nm-flat-white-xl sm:p-10'>
          <p className='text-sm font-bold tracking-widest text-red-500 uppercase font-ox'>
            Chronological portfolio
          </p>
          <h1 className='pt-3 text-4xl font-black leading-tight text-gray-900 sm:text-6xl font-ox'>
            Current systems first. Historical work with context.
          </h1>
          <p className='max-w-3xl pt-5 text-lg leading-8 text-gray-700'>
            This feed is the public reading order for the work: active systems, shipped rebuilds, focused utilities, and historical artifacts that still explain the direction.
          </p>
          <div className='grid gap-4 pt-8 text-sm text-gray-700 sm:grid-cols-3'>
            <div className='p-4 rounded nm-concave-white-sm'>
              <span className='block text-2xl font-black text-red-500 font-ox'>01</span>
              Lead with maintained systems and deployed work.
            </div>
            <div className='p-4 rounded nm-concave-white-sm'>
              <span className='block text-2xl font-black text-red-500 font-ox'>02</span>
              Keep historical repos when they clarify the arc.
            </div>
            <div className='p-4 rounded nm-concave-white-sm'>
              <span className='block text-2xl font-black text-red-500 font-ox'>03</span>
              Rebuild only when v2 improves the original vision.
            </div>
          </div>
        </div>

        <div className='grid gap-6'>
          {timeline.map((project, index) => (
            <TimelineCard
              key={project.title}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
