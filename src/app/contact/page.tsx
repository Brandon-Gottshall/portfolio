import { Mail, Linkedin, Github } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-light text-navy dark:text-cream mb-4 tracking-tight">Get in Touch</h1>
        <p className="text-lg text-gray dark:text-tan mb-12 leading-relaxed">
          I&apos;m always interested in hearing about new projects and opportunities.
          Feel free to reach out through any of the following <span className="font-code">channels</span>.
        </p>

        <div className="space-y-8">
          <a
            href="mailto:blgottshall@gmail.com"
            className="flex items-center p-6 rounded-xl 
              border border-navy/10 dark:border-cream/10 
              bg-white/60 dark:bg-navy-light/20
              hover:border-navy/30 dark:hover:border-cream/30 
              transition-all group"
          >
            <Mail className="w-6 h-6 mr-4 text-navy dark:text-cream group-hover:text-blue dark:group-hover:text-blue-accent transition-colors" />
            <div>
              <h2 className="text-xl font-light tracking-tight text-navy dark:text-cream mb-1">Email</h2>
              <p className="text-gray dark:text-tan/80 font-code">blgottshall@gmail.com</p>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/brandon-gottshall"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-6 rounded-xl 
              border border-navy/10 dark:border-cream/10 
              bg-white/60 dark:bg-navy-light/20
              hover:border-navy/30 dark:hover:border-cream/30 
              transition-all group"
          >
            <Linkedin className="w-6 h-6 mr-4 text-navy dark:text-cream group-hover:text-blue dark:group-hover:text-blue-accent transition-colors" />
            <div>
              <h2 className="text-xl font-light tracking-tight text-navy dark:text-cream mb-1">LinkedIn</h2>
              <p className="text-gray dark:text-tan/80">Connect with me professionally</p>
            </div>
          </a>

          <a
            href="https://github.com/Brandon-Gottshall"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-6 rounded-xl 
              border border-navy/10 dark:border-cream/10 
              bg-white/60 dark:bg-navy-light/20
              hover:border-navy/30 dark:hover:border-cream/30 
              transition-all group"
          >
            <Github className="w-6 h-6 mr-4 text-navy dark:text-cream group-hover:text-blue dark:group-hover:text-blue-accent transition-colors" />
            <div>
              <h2 className="text-xl font-light tracking-tight text-navy dark:text-cream mb-1">GitHub</h2>
              <p className="text-gray dark:text-tan/80">Check out my <span className="font-code">code</span> and contributions</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
} 