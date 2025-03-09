import { Mail, Linkedin, Github } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-light mb-8">Get in Touch</h1>
        <p className="text-lg text-gray mb-12">
          I&apos;m always interested in hearing about new projects and opportunities.
          Feel free to reach out through any of the following channels.
        </p>

        <div className="space-y-8">
          <a
            href="mailto:Brandon.Gottshall@gmail.com"
            className="flex items-center p-6 rounded-xl border border-navy/10 hover:border-navy/30 transition-all group"
          >
            <Mail className="w-6 h-6 mr-4 group-hover:text-red transition-colors" />
            <div>
              <h2 className="text-xl font-light mb-1">Email</h2>
              <p className="text-gray">Brandon.Gottshall@gmail.com</p>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/brandon-gottshall"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-6 rounded-xl border border-navy/10 hover:border-navy/30 transition-all group"
          >
            <Linkedin className="w-6 h-6 mr-4 group-hover:text-red transition-colors" />
            <div>
              <h2 className="text-xl font-light mb-1">LinkedIn</h2>
              <p className="text-gray">Connect with me professionally</p>
            </div>
          </a>

          <a
            href="https://github.com/Brandon-Gottshall"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-6 rounded-xl border border-navy/10 hover:border-navy/30 transition-all group"
          >
            <Github className="w-6 h-6 mr-4 group-hover:text-red transition-colors" />
            <div>
              <h2 className="text-xl font-light mb-1">GitHub</h2>
              <p className="text-gray">Check out my code and contributions</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
} 