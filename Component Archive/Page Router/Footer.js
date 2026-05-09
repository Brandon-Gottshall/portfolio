'use client'

import Link from 'next/link'
import { LinkedIn, GitHub, Mail, Calendar } from 'lucide-react'

const Footer = () => {
  console.log('Footer component is rendering')
  const currentYear = new Date().getFullYear()
  const lastUpdated = '2024-03-09' // Update this manually or dynamically

  return (
    <footer className="bg-navy text-cream w-full">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* CTA Section */}
          <div className="md:col-span-4 flex flex-col justify-center items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">
              Let&apos;s Create Something Amazing
            </h3>
            <Link
              href="/contact"
              className="bg-cream text-navy hover:bg-red hover:text-cream transition-colors duration-300 px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Schedule a Call
            </Link>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <p className="text-gray-300 mb-4">
              Reach out to discuss opportunities
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/in/brandon-gottshall"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red transition-colors duration-300"
                aria-label="LinkedIn Profile"
              >
                <LinkedIn className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/Brandon-Gottshall"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red transition-colors duration-300"
                aria-label="GitHub Profile"
              >
                <GitHub className="w-6 h-6" />
              </a>
              <a
                href="mailto:Brandon.Gottshall@gmail.com"
                className="hover:text-red transition-colors duration-300"
                aria-label="Email Contact"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="hover:text-red transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="hover:text-red transition-colors duration-300"
              >
                Projects
              </Link>
              <Link
                href="/resume"
                className="hover:text-red transition-colors duration-300"
              >
                Resume
              </Link>
              <Link
                href="/contact"
                className="hover:text-red transition-colors duration-300"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray">
            <p>© {currentYear} Brandon Gottshall. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
