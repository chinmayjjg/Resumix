import Link from "next/link";
import { ArrowRight, FileText, Star, Cloud, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground tracking-tight selection:bg-primary/20">

      {/* Hero Section */}
      <main className="flex-grow pt-32 lg:pt-48 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2 flex flex-col items-start text-left space-y-6">
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
              Precision Career Narratives
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-[1.05] text-[#111111]">
              Your Resume,<br />
              Transformed into a<br />
              <span className="italic text-primary font-serif">Professional Portfolio</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-lg font-light leading-relaxed">
              Resumix crafts editorial-grade portfolio websites from your existing PDF resume in seconds. No code, just curated professional impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Link
                href="/login"
                className="px-8 py-3.5 bg-[#111111] text-white text-base rounded-sm font-medium hover:bg-black/90 transition-all text-center"
              >
                Build Your Portfolio
              </Link>
              <Link
                href="#themes"
                className="px-8 py-3.5 bg-slate-100 text-slate-700 text-base rounded-sm font-medium hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                View Showcase <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full mt-10 lg:mt-0 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-[4/5] md:aspect-square bg-white shadow-2xl rotate-3 rounded-lg overflow-hidden border-[8px] border-white z-10 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" 
                alt="Laptop displaying resume" 
                className="w-full h-full object-cover rounded-md opacity-90"
              />
            </div>
            <div className="absolute top-10 right-10 w-full max-w-lg aspect-square bg-[#e6e5e3] rounded-lg -z-10 -rotate-3"></div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#f1f0ee] relative z-10 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-serif text-[#111111] mb-3">Precision Engineering</h2>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">No System Complexities</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-10 flex flex-col justify-between aspect-square group shadow-sm">
              <div className="w-12 h-12 bg-[#faeceb] flex items-center justify-center rounded-sm text-primary mb-12">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#111111] mb-3">One-Click PDF Import</h3>
                <p className="text-slate-500 font-light text-sm leading-relaxed">
                  Our AI-driven engine parses your existing resume data instantly. No manual typing required.
                </p>
              </div>
            </div>

            {/* Card 2 - Black */}
            <div className="bg-[#111111] p-10 flex flex-col justify-between aspect-square group shadow-xl -mt-4 mb-4 md:mt-0 md:mb-0 relative z-20">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-sm text-white mb-12 relative overflow-hidden">
                 <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white mb-3">Designer-Crafted Themes</h3>
                <p className="text-slate-400 font-light text-sm leading-relaxed">
                  Select from styles inspired by high-end typography and architectural monographs.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 flex flex-col justify-between aspect-square group shadow-sm">
              <div className="w-12 h-12 bg-[#faeceb] flex items-center justify-center rounded-sm text-primary mb-12">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#111111] mb-3">Instant, Secure Hosting</h3>
                <p className="text-slate-500 font-light text-sm leading-relaxed">
                  Your professional identity lives in seconds on a global CDN. Fast, secure, and permanent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section id="themes" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-serif text-[#111111] mb-4">Curated Visual Languages</h2>
              <p className="text-slate-500 font-light">
                Select from styles that match your industry's gravity. From tech-forward minimalism to executive authority.
              </p>
            </div>
            <Link href="#themes" className="text-primary text-xs uppercase tracking-widest font-bold border-b border-primary/30 pb-1 hover:border-primary transition-colors">
              View All Themes
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Theme 1 */}
            <div>
              <div className="aspect-[4/5] bg-[#1a1f24] p-8 flex flex-col justify-center items-center rounded-sm border border-[#2a3038] mb-4 shadow-xl">
                <div className="w-full h-full border border-slate-700/50 rounded flex flex-col p-6 overflow-hidden">
                    <div className="w-full flex justify-between items-center border-b border-slate-700 pb-4 mb-4">
                        <div className="w-20 h-3 bg-slate-700 rounded-sm"></div>
                        <div className="flex space-x-2"><div className="w-10 h-2 bg-slate-700"></div><div className="w-10 h-2 bg-slate-700"></div></div>
                    </div>
                    <div className="flex-1 mt-8">
                       <div className="w-32 h-6 bg-slate-600 mb-6"></div>
                       <div className="w-full h-2 bg-slate-700 mb-2"></div>
                       <div className="w-3/4 h-2 bg-slate-700 mb-2"></div>
                       <div className="w-full h-2 bg-slate-700 mb-2"></div>
                       <div className="w-5/6 h-2 bg-slate-700"></div>
                    </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-serif font-medium">The Modern</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">Tech / Design</span>
              </div>
            </div>

            {/* Theme 2 */}
            <div>
              <div className="aspect-[4/5] bg-[#0a0a0a] p-8 flex flex-col justify-center items-center rounded-sm border border-[#1a1a1a] mb-4 shadow-xl shadow-black/20">
                <div className="w-5/6 h-5/6 border-t-2 border-slate-600 flex flex-col items-center pt-8">
                    <div className="tracking-[0.3em] text-xs text-slate-400 mb-8 border-b border-slate-800 pb-2">EXECUTIVE</div>
                    <div className="w-full text-center space-y-4">
                        <div className="w-full h-px bg-slate-800"></div>
                        <div className="w-full h-3 bg-slate-800 mx-auto max-w-[80%]"></div>
                        <div className="w-full h-px bg-slate-800"></div>
                    </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-serif font-medium">The Executive</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">Finance / Mgmt</span>
              </div>
            </div>

            {/* Theme 3 */}
            <div>
              <div className="aspect-[4/5] bg-[#161616] p-8 flex flex-col justify-center items-center rounded-sm border border-[#222222] mb-4 shadow-black/10 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                <div className="font-serif italic text-4xl text-[#e89679] -rotate-6 shadow-sm relative z-10 transform scale-125 font-bold">
                    The<br/>Creative
                </div>
                <div className="absolute w-2 h-2 rounded-full bg-primary/40 top-1/4 right-1/4"></div>
                <div className="absolute w-1 h-1 rounded-full bg-primary/60 bottom-1/4 left-1/3"></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-serif font-medium">The Creative</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">Media / Art</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 border-t border-slate-200/50 bg-white">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 item-start">
              <div className="md:w-1/3 md:sticky md:top-32 h-fit">
                  <h2 className="text-4xl md:text-5xl font-serif text-[#111111] leading-[1.1] mb-6">
                      The Three-<br/>Step<br/>
                      <span className="italic text-primary">Transformation</span>
                  </h2>
                  <p className="text-slate-500 font-light leading-relaxed">
                      We've eliminated the friction of web development. You bring the content, we bring the curation.
                  </p>
              </div>

              <div className="md:w-2/3 space-y-24">
                  {/* Step 1 */}
                  <div className="flex gap-8 group">
                      <div className="text-6xl md:text-8xl font-serif italic text-slate-200 mt-[-10px] group-hover:text-primary/20 transition-colors duration-500">
                          01
                      </div>
                      <div>
                          <h3 className="text-2xl font-serif font-bold text-[#111111] mb-4">Upload PDF</h3>
                          <p className="text-slate-500 font-light leading-relaxed max-w-md">
                              Drop your standard resume PDF into our workspace. Our system identifies your skills, experience, and achievements with surgical precision.
                          </p>
                      </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-8 group">
                      <div className="text-6xl md:text-8xl font-serif italic text-slate-200 mt-[-10px] group-hover:text-primary/20 transition-colors duration-500">
                          02
                      </div>
                      <div>
                          <h3 className="text-2xl font-serif font-bold text-[#111111] mb-4">Choose Theme</h3>
                          <p className="text-slate-500 font-light leading-relaxed max-w-md">
                              Select a visual language that echoes your professional personality. Instantly, see your data reconstructed into a premium web experience.
                          </p>
                      </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-8 group">
                      <div className="text-6xl md:text-8xl font-serif italic text-slate-200 mt-[-10px] group-hover:text-primary/20 transition-colors duration-500">
                          03
                      </div>
                      <div>
                          <h3 className="text-2xl font-serif font-bold text-[#111111] mb-4">Go Live</h3>
                          <p className="text-slate-500 font-light leading-relaxed max-w-md">
                              Hit publish. Your new portfolio is optimized for search engines and mobile viewing. Share a link that does justice to your career.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto bg-[#0a0a0a] rounded-lg p-16 md:p-24 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <span className="text-[#e25d48] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                Join 10,000+ Professionals
              </span>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                Join 10,000+ Professionals<br/>Making an Impact.
              </h2>
              <p className="text-lg text-slate-400 font-light mb-10 leading-relaxed">
                Stop sending static files. Start sending experiences. Your professional legacy deserves a better stage.
              </p>
              <Link
                href="/login"
                className="px-10 py-4 bg-white text-[#111111] text-base rounded-sm font-medium hover:bg-slate-100 transition-all shadow-xl hover:scale-[1.02]"
              >
                Get Started for Free
              </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f6f5f3] border-t border-slate-200/50 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="flex flex-col items-start gap-4">
            <span className="text-2xl font-serif font-bold text-[#111111]">Resumix.</span>
            <p className="text-slate-500 text-xs tracking-wide">
              © 2026 Resumix. Precision Editorial for Professional Identities.
            </p>
          </div>
          <div className="flex gap-8 text-xs font-medium tracking-wide text-slate-500 uppercase">
            <a href="#" className="hover:text-[#111111] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#111111] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#111111] transition-colors">Contact</a>
            <a href="#" className="hover:text-[#111111] transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
