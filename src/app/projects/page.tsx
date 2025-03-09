export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-8">Projects</h1>
      <p className="text-lg text-gray mb-8">
        Explore my portfolio of web development and software engineering projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Project cards will go here */}
        <div className="p-6 rounded-xl border border-navy/10 hover:border-navy/30 transition-all">
          <h2 className="text-2xl font-light mb-4">Coming Soon</h2>
          <p className="text-gray">Project details will be available shortly.</p>
        </div>
      </div>
    </div>
  );
} 