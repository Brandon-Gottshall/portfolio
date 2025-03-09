"use client"

import Image from "next/image"
import { ArrowRight, CheckCircle, ExternalLink, Github, Star, Terminal } from "lucide-react"

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

  const skills = [
    {
      category: "Frontend",
      items: [
        { name: "Next.js", level: 95 },
        { name: "React", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Tailwind CSS", level: 90 },
        { name: "Framer Motion", level: 85 },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", level: 85 },
        { name: "API Routes", level: 90 },
        { name: "Prisma", level: 85 },
        { name: "MongoDB", level: 80 },
        { name: "PostgreSQL", level: 75 },
      ],
    },
    {
      category: "DevOps",
      items: [
        { name: "Vercel", level: 90 },
        { name: "CI/CD", level: 85 },
        { name: "Docker", level: 80 },
        { name: "AWS", level: 75 },
        { name: "Testing", level: 85 },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto py-20 md:py-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-navy/10 text-navy text-sm mb-6">
            <span className="mr-2">✓</span> Available for new projects
          </div>
          <h1 className="text-5xl md:text-6xl font-light leading-tight mb-6">
            Building <span className="text-navy">Modern Web Experiences</span> with Next.js
          </h1>
          <p className="text-gray text-xl mb-8 max-w-xl">
            I&apos;m Brandon, a specialized software engineer with experience crafting high-performance, scalable
            web applications that users love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-navy text-cream font-medium rounded-lg flex items-center gap-2 hover:bg-navy/90 transition-colors">
              View My Work <ArrowRight className="h-4 w-4" />
            </button>
            <button className="px-6 py-3 bg-transparent border border-navy/30 text-navy font-medium rounded-lg hover:bg-navy/10 transition-colors">
              Contact Me
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <div className="relative">
            {/* Decorative circle behind portrait */}
            <div className="absolute w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full bg-navy/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Decorative elements */}
            <div className="absolute w-full h-full">
              <div className="absolute top-0 right-0 w-20 h-20 bg-navy/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-navy/10 rounded-full blur-xl"></div>
            </div>

            {/* Portrait with frame */}
            <div className="relative z-10 bg-gradient-to-b from-navy/20 to-background p-1 rounded-full">
              <div className="overflow-hidden rounded-full border-2 border-navy/10">
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
      </section>

      {/* Why Choose Me Section */}
      <section className="container mx-auto py-20 bg-navy/5 rounded-3xl my-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-4">Why Work With Me?</h2>
          <p className="text-gray text-lg max-w-2xl mx-auto">
            I bring technical expertise, business understanding, and a commitment to excellence to every project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="bg-background p-8 rounded-xl border border-navy/10 hover:border-navy/30 transition-all hover:shadow-lg hover:shadow-navy/5">
            <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center mb-6">
              <Terminal className="h-6 w-6 text-navy" />
            </div>
            <h3 className="text-xl font-light mb-3">Technical Excellence</h3>
            <p className="text-gray">
              I write clean, maintainable code following best practices. My applications are fast, secure, and built
              with scalability in mind.
            </p>
          </div>

          <div className="bg-background p-8 rounded-xl border border-navy/10 hover:border-navy/30 transition-all hover:shadow-lg hover:shadow-navy/5">
            <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center mb-6">
              <Star className="h-6 w-6 text-navy" />
            </div>
            <h3 className="text-xl font-light mb-3">Modern Stack</h3>
            <p className="text-gray">
              I specialize in Next.js, React, TypeScript and modern tools that enable rapid development without
              compromising on quality.
            </p>
          </div>

          <div className="bg-background p-8 rounded-xl border border-navy/10 hover:border-navy/30 transition-all hover:shadow-lg hover:shadow-navy/5">
            <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center mb-6">
              <CheckCircle className="h-6 w-6 text-navy" />
            </div>
            <h3 className="text-xl font-light mb-3">Results-Driven</h3>
            <p className="text-gray">
              I focus on delivering business value, not just code. Your success is my priority, and I measure my work by
              the results it generates.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto py-16">
        <h2 className="text-3xl font-light mb-12 text-center">Technical Expertise</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {skills.map((skillGroup) => (
            <div key={skillGroup.category}>
              <h3 className="text-xl font-light mb-6 text-navy">{skillGroup.category}</h3>
              <div className="space-y-6">
                {skillGroup.items.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span>{skill.name}</span>
                      <span className="text-gray">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-navy/10 rounded-full overflow-hidden">
                      <div className="h-full bg-navy rounded-full" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="container mx-auto py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-light mb-4">Featured Projects</h2>
            <p className="text-gray max-w-2xl">
              A selection of my recent work building modern web applications
            </p>
          </div>
          <button className="text-navy flex items-center gap-1 hover:underline">
            View All Projects <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer bg-navy/5 rounded-xl overflow-hidden border border-transparent hover:border-navy/20 transition-all hover:shadow-lg hover:shadow-navy/5"
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
                <h3 className="text-xl font-light mb-2">{project.title}</h3>
                <p className="text-gray text-sm mb-4">{project.description}</p>
                <p className="text-sm mb-4 text-navy">{project.challenge}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 bg-navy/10 text-navy rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button className="text-navy text-sm flex items-center gap-1 hover:underline">
                    View Case Study <ArrowRight className="h-3 w-3" />
                  </button>
                  <button className="text-gray text-sm flex items-center gap-1 hover:text-navy transition-colors">
                    <ExternalLink className="h-3 w-3" /> Live Demo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto py-20 my-16">
        <div className="bg-navy/5 rounded-3xl p-8 md:p-12 border border-navy/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6">Ready to Build Something Amazing?</h2>
            <p className="text-gray text-lg mb-8">
              I&apos;m currently available for freelance projects, full-time positions, and consulting work. Let&apos;s discuss
              how I can help bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-navy text-cream font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-navy/90 transition-colors">
                Schedule a Call
              </button>
              <button className="px-8 py-4 bg-transparent border border-navy/30 text-navy font-medium rounded-lg hover:bg-navy/10 transition-colors flex items-center justify-center gap-2">
                <Github className="h-5 w-5" />
                View GitHub
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
