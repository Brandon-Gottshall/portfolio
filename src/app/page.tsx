export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <h1 className="text-4xl font-light mb-2">Brandon Gottshall</h1>
        <p className="text-xl text-gray">Software Engineer & Web Developer</p>
      </section>

      <section className="max-w-xl">
        <h2 className="text-2xl font-light mb-6">Color Palette</h2>
        <div className="grid grid-cols-5 gap-6">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-lg bg-navy shadow-sm"></div>
            <p className="text-xs font-mono opacity-75">Navy<br/>#1A237E</p>
          </div>
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-lg bg-red shadow-sm"></div>
            <p className="text-xs font-mono opacity-75">Red<br/>#974951</p>
          </div>
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-lg bg-gray shadow-sm"></div>
            <p className="text-xs font-mono opacity-75">Gray<br/>#959991</p>
          </div>
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-lg bg-tan shadow-sm"></div>
            <p className="text-xs font-mono opacity-75">Tan<br/>#D7CBA9</p>
          </div>
          <div className="space-y-2 dark:hidden">
            <div className="w-16 h-16 rounded-lg bg-cream shadow-sm"></div>
            <p className="text-xs font-mono opacity-75">Cream<br/>#E3DEC8</p>
          </div>
          <div className="space-y-2 hidden dark:block">
            <div className="w-16 h-16 rounded-lg bg-black border border-tan/20 shadow-sm"></div>
            <p className="text-xs font-mono opacity-75">Black<br/>#000000</p>
          </div>
        </div>
      </section>
    </div>
  );
}
