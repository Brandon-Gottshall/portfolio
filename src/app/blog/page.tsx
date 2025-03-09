export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-8">Blog</h1>
      <p className="text-lg text-gray mb-12">
        Thoughts, insights, and experiences from my journey in software development.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder blog post */}
        <article className="p-6 rounded-xl border border-navy/10 hover:border-navy/30 transition-all">
          <div className="mb-4">
            <span className="text-sm text-gray">Coming Soon</span>
          </div>
          <h2 className="text-2xl font-light mb-4">First Blog Post</h2>
          <p className="text-gray mb-4">
            Stay tuned for upcoming articles about web development, software engineering,
            and technology insights.
          </p>
          <div className="flex gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-navy/10 text-navy">
              Web Development
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-navy/10 text-navy">
              Tech
            </span>
          </div>
        </article>
      </div>
    </div>
  );
} 