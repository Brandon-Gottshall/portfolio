export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-navy dark:text-cream mb-4 tracking-tight">Blog</h1>
        <p className="text-lg text-gray dark:text-tan leading-relaxed">
          Thoughts, insights, and experiences from my journey in <span className="font-code">software development</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder blog post */}
        <article className="p-6 rounded-xl border border-navy/10 dark:border-cream/10 
          bg-white/60 dark:bg-navy-light/20 
          hover:border-navy/30 dark:hover:border-cream/30 
          transition-all">
          <div className="mb-4">
            <span className="font-code text-sm text-gray/60 dark:text-tan/60">Coming Soon</span>
          </div>
          <h2 className="text-2xl font-light tracking-tight text-navy dark:text-cream mb-4">First Blog Post</h2>
          <p className="text-gray dark:text-tan/80 mb-4 leading-relaxed">
            Stay tuned for upcoming articles about web development, software engineering,
            and technology insights.
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 text-[10px] font-code rounded-full 
              bg-navy/5 dark:bg-cream/5 
              text-navy/70 dark:text-cream/70 
              border border-navy/10 dark:border-cream/10">
              Web Development
            </span>
            <span className="px-3 py-1 text-[10px] font-code rounded-full 
              bg-navy/5 dark:bg-cream/5 
              text-navy/70 dark:text-cream/70 
              border border-navy/10 dark:border-cream/10">
              Tech
            </span>
          </div>
        </article>
      </div>
    </div>
  );
} 