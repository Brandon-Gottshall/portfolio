"use client"

import Image from "next/image"
import { ArrowRight, CheckCircle, ExternalLink, Github, Star, Terminal } from "lucide-react"
import { TextLoop } from "react-text-loop-next"
import GithubLanguageStats from '@/components/GithubLanguageStats'

export default function Home() {
  const projects = [
    {
      id: 1,
      title: "Project One",
      description: "Web App",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
      challenge: "Built a high-performance dashboard with real-time data visualization",
    },
    {
      id: 2,
      title: "Project Two",
      description: "Mobile App",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["React Native", "Next.js API Routes", "MongoDB"],
      challenge: "Developed a cross-platform mobile app with seamless API integration",
    },
    {
      id: 3,
      title: "Project Three",
      description: "E-commerce",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Next.js", "Stripe", "Sanity CMS", "Vercel"],
      challenge: "Created a high-converting e-commerce platform with 99% Lighthouse score",
    }
  ]

  return (
    <main className="min-h-screen bg-cream dark:bg-navy-darkest">
      {/* Hero Section */}
      <section className="bg-cream dark:bg-navy-darkest pt-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 z-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-navy/10 dark:bg-cream/10 text-navy dark:text-cream text-sm mb-6">
                <span className="mr-2">✓</span> Available for new projects
              </div>
              <h1 className="text-5xl md:text-6xl font-light leading-tight mb-2 text-navy dark:text-cream tracking-tight">
                Brandon Gottshall
              </h1>
              <div className="mb-6">
                <TextLoop interval={2000}>
                  <span className="font-code text-2xl md:text-3xl font-light text-gray-dark dark:text-tan">Software Engineer</span>
                  <span className="text-2xl md:text-3xl font-light text-gray-dark dark:text-tan">SE Bootcamp Instructor</span>
                  <span className="text-2xl md:text-3xl font-light text-gray-dark dark:text-tan">Marine Corps Veteran</span>
                  <span className="text-2xl md:text-3xl font-light text-gray-dark dark:text-tan">Lifetime Student</span>
                  <span className="font-code text-2xl md:text-3xl font-light text-gray-dark dark:text-tan">Automation Enthusiast</span>
                </TextLoop>
              </div>
              <p className="text-lg mb-8 max-w-xl text-gray-dark dark:text-tan font-normal">
                I&apos;m a specialized software engineer with experience crafting high-performance, scalable
                web applications that users love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-red hover:bg-red-bright text-cream font-medium rounded-lg flex items-center gap-2 transition-colors">
                  View My Work <ArrowRight className="h-4 w-4" />
                </button>
                <button className="px-6 py-3 bg-transparent border border-navy/20 dark:border-cream/20 text-navy dark:text-cream font-medium rounded-lg hover:bg-navy/5 dark:hover:bg-cream/5 transition-colors">
                  Contact Me
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="relative">
                {/* Decorative circle behind portrait */}
                <div className="absolute w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full bg-gradient-to-br from-red/10 to-navy/10 dark:from-red/5 dark:to-cream/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

                {/* Decorative elements */}
                <div className="absolute w-full h-full">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red/5 dark:bg-red/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-10 left-10 w-16 h-16 bg-navy/5 dark:bg-cream/10 rounded-full blur-xl"></div>
                </div>

                {/* Portrait with frame */}
                <div className="relative z-10 bg-gradient-to-b from-red/10 to-navy/5 dark:from-red/10 dark:to-cream/5 p-1 rounded-full">
                  <div className="overflow-hidden rounded-full border border-navy/10 dark:border-cream/10">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ProfileTransparent-LKlc3BUBnMuebS911NlTSuJjHfqwoy.webp"
                      alt="Brandon - Software Engineer"
                      width={300}
                      height={300}
                      className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="bg-cream dark:bg-navy-darkest pt-10 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-navy dark:text-cream tracking-tight">
              Why Work With Me?
            </h2>
            <p className="text-gray-dark dark:text-tan text-lg max-w-2xl mx-auto">
              I bring technical expertise, business understanding, and a commitment to excellence to every project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 dark:bg-navy p-8 rounded-xl border border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-cream dark:bg-navy-light/50 rounded-lg flex items-center justify-center mb-6">
                <Terminal className="h-6 w-6 text-navy dark:text-cream" />
              </div>
              <h3 className="text-xl font-light mb-3 text-navy dark:text-cream">Technical Excellence</h3>
              <p className="text-gray-dark dark:text-tan">
                I write <span className="font-code">clean, maintainable code</span> following best practices. My applications are fast, secure, and built
                with scalability in mind.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-navy p-8 rounded-xl border border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-cream dark:bg-navy-light/50 rounded-lg flex items-center justify-center mb-6">
                <Star className="h-6 w-6 text-navy dark:text-cream" />
              </div>
              <h3 className="text-xl font-light mb-3 text-navy dark:text-cream">Modern Stack</h3>
              <p className="text-gray-dark dark:text-tan">
                I specialize in Next.js, React, TypeScript and modern tools that enable rapid development without
                compromising on quality.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-navy p-8 rounded-xl border border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-cream dark:bg-navy-light/50 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-navy dark:text-cream" />
              </div>
              <h3 className="text-xl font-light mb-3 text-navy dark:text-cream">Results-Driven</h3>
              <p className="text-gray-dark dark:text-tan">
                I focus on delivering business value, not just code. Your success is my priority, and I measure my work by
                the results it generates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-cream-dark/50 dark:bg-navy py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4 text-navy dark:text-cream tracking-tight">
              Technical Expertise
            </h2>
            <p className="text-gray-dark dark:text-tan text-lg max-w-2xl mx-auto">
              Analysis of my GitHub repositories, showing the percentage of projects using each technology. 
              Hover over items to see detailed usage information.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* GitHub Language Stats */}
            <div>
              <h3 className="text-xl font-light mb-6 text-navy dark:text-cream flex items-center gap-2">
                Language Distribution
                <span className="text-sm text-gray-dark dark:text-tan font-normal" title="Shows percentage of my commits containing each programming language">ⓘ</span>
              </h3>
              <GithubLanguageStats type="languages" />
            </div>

            {/* GitHub Framework Stats */}
            <div>
              <h3 className="text-xl font-light mb-6 text-navy dark:text-cream flex items-center gap-2">
                Framework Distribution
                <span className="text-sm text-gray-dark dark:text-tan font-normal" title="Shows percentage of my commits that use each framework">ⓘ</span>
              </h3>
              <GithubLanguageStats type="frameworks" />
            </div>

            {/* GitHub Tools Stats */}
            <div>
              <h3 className="text-xl font-light mb-6 text-navy dark:text-cream flex items-center gap-2">
                Development Tools
                <span className="text-sm text-gray-dark dark:text-tan font-normal" title="Shows percentage of my commits that use each development tool">ⓘ</span>
              </h3>
              <GithubLanguageStats type="tools" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="bg-cream dark:bg-navy-darkest py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-light mb-4 text-navy dark:text-cream">Featured Projects</h2>
              <p className="text-gray-dark dark:text-tan max-w-2xl">
                A selection of my recent work building modern web applications
              </p>
            </div>
            <button className="text-navy dark:text-cream flex items-center gap-1 hover:text-red dark:hover:text-red-bright transition-colors">
              View All Projects <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer bg-white/80 dark:bg-navy rounded-xl overflow-hidden border border-navy/10 dark:border-cream/10 hover:border-navy/30 dark:hover:border-cream/30 transition-all hover:shadow-lg"
              >
                <div className="overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-light mb-2 text-navy dark:text-cream">{project.title}</h3>
                  <p className="text-gray-dark dark:text-tan text-sm mb-4">{project.description}</p>
                  <p className="text-sm mb-4 text-red/90 dark:text-red-bright/90">{project.challenge}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 bg-cream dark:bg-navy-light/50 text-navy dark:text-cream rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <button className="text-navy dark:text-cream text-sm flex items-center gap-1 hover:text-red dark:hover:text-red-bright transition-colors">
                      View Case Study <ArrowRight className="h-3 w-3" />
                    </button>
                    <button className="text-gray-dark dark:text-tan text-sm flex items-center gap-1 hover:text-navy dark:hover:text-cream transition-colors">
                      <ExternalLink className="h-3 w-3" /> Live Demo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-cream dark:bg-navy-darkest py-20">
        <div className="container mx-auto px-6">
          <div className="bg-white/80 dark:bg-navy rounded-3xl p-8 md:p-12 border border-navy/10 dark:border-cream/10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-navy dark:text-cream">Ready to Build Something Amazing?</h2>
              <p className="text-gray-dark dark:text-tan text-lg mb-8">
                I&apos;m currently available for freelance projects, full-time positions, and consulting work. Let&apos;s discuss
                how I can help bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-red hover:bg-red-bright text-cream font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                  Schedule a Call
                </button>
                <button className="px-8 py-4 bg-transparent border border-navy/20 dark:border-cream/20 text-navy dark:text-cream font-medium rounded-lg hover:bg-navy/5 dark:hover:bg-cream/5 transition-colors flex items-center justify-center gap-2">
                  <Github className="h-5 w-5" />
                  View GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
