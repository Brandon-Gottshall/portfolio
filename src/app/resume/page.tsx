export default function ResumePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-8">Resume</h1>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-light mb-4">Professional Summary</h2>
          <p className="text-gray mb-4">
            Experienced Software Engineer specializing in modern web
            technologies and full-stack development.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-light mb-4">Experience</h2>
          <div className="space-y-8">
            <div className="p-6 rounded-xl border border-navy/10">
              <h3 className="text-xl mb-2">Coming Soon</h3>
              <p className="text-gray">
                Professional experience details will be available shortly.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-light mb-4">Education</h2>
          <div className="p-6 rounded-xl border border-navy/10">
            <h3 className="text-xl mb-2">Coming Soon</h3>
            <p className="text-gray">
              Education details will be available shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
