'use client';

import Link from 'next/link';
import { Linkedin, Github, Mail, Calendar } from 'lucide-react';

interface FooterProps {
  lastUpdated: string;
}

const Footer = ({ lastUpdated }: FooterProps) => {
  console.log('Footer component is rendering');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-dark">
      {/* Main Footer Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Top row: 3 columns, centered as a group */}
        <div className="flex flex-col md:flex-row justify-center md:justify-evenly items-center md:items-start gap-8">
          {/* CTA Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">Let&apos;s Create Something Amazing</h3>
            <Link
              href="/contact"
              className="bg-cream text-navy hover:bg-red hover:text-cream dark:bg-tan dark:text-black transition-colors duration-300 px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Schedule a Call
            </Link>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <p className="text-cream/80 dark:text-tan/80 mb-4">Reach out to discuss opportunities</p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/in/brandon-gottshall"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red transition-colors duration-300"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/Brandon-Gottshall"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red transition-colors duration-300"
                aria-label="GitHub Profile"
              >
                <Github className="w-6 h-6" />
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
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="hover:text-red transition-colors duration-300">
                Home
              </Link>
              <Link href="/projects" className="hover:text-red transition-colors duration-300">
                Projects
              </Link>
              <Link href="/resume" className="hover:text-red transition-colors duration-300">
                Resume
              </Link>
              <Link href="/contact" className="hover:text-red transition-colors duration-300">
                Contact
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/20 dark:border-tan/20 pt-4">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-sm text-cream/60 dark:text-tan/60 gap-2">
            <p>© {currentYear} Brandon Gottshall. All rights reserved.</p>
            <p>Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 