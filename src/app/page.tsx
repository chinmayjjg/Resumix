import Link from "next/link";
import { Sparkles, FileText, Palette, Globe, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden relative">

      {/* Soft Background Effects */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-primary/10 blur-[100px] opacity-70 animate-pulse delay-700"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full bg-secondary/80 blur-[100px] opacity-60"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Hero Section */}
      <main className="flex-grow pt-32 pb-20 px-6 relative z-10">
        <section className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-slate-600 tracking-wide">The Ultimate Portfolio Builder</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 leading-[1.1] text-foreground">
            Turn Your Resume into a <br className="hidden md:block" />
            <span className="italic text-primary relative inline-block px-2">
              Website
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary fill-current -z-10 opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5"></path>
              </svg>
            </span>
            <span className="ml-3">Instantly</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Stop coding from scratch. Upload your PDF resume and let our smart builder automatically format it into a stunning, shareable portfolio in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link
              href="/dashboard"
              className="group relative px-10 py-4 bg-primary text-primary-foreground text-lg rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
            >
              <span className="relative flex items-center gap-2">
                Build My Portfolio <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="#features"
              className="px-10 py-4 bg-white/60 backdrop-blur-sm text-foreground border border-black/5 text-lg rounded-full font-medium hover:bg-white transition-all hover:shadow-sm"
            >
              Learn More
            </Link>
          </div>

          {/* Elegant UI Preview */}
          <div className="mt-24 relative max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/40 rounded-[2rem] blur-2xl opacity-40"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl overflow-hidden aspect-[16/9] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-grid-slate-500/[0.02] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
              <div className="text-center relative z-10 w-full max-w-md p-10 bg-white shadow-sm rounded-xl border border-slate-100">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-serif mb-3 text-foreground">Beautiful Themes</h3>
                <p className="text-muted-foreground text-lg">Modern, Minimal, Creative layouts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-serif mb-6 text-foreground">Why Choose Resumix?</h2>
              <p className="text-xl text-muted-foreground">Everything you need to showcase your work professionally.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white p-10 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 text-2xl group-hover:scale-105 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif mb-4 text-foreground">One-Click Import</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simply upload your PDF resume. Our smart system extracts your skills and projects instantly.
                </p>
              </div>

              <div className="group bg-white p-10 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600 text-2xl group-hover:scale-105 transition-transform">
                  <Palette className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif mb-4 text-foreground">Premium Themes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose from our curated collection of professional templates. Match your personal brand.
                </p>
              </div>

              <div className="group bg-white p-10 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 text-green-600 text-2xl group-hover:scale-105 transition-transform">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif mb-4 text-foreground">Instant Hosting</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get a unique <code className="bg-slate-100 px-2 py-0.5 rounded text-sm font-mono text-foreground">/yourname</code> URL immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-foreground rounded-[2.5rem] p-16 text-center text-primary-foreground shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <h2 className="text-4xl font-serif mb-6 relative z-10 text-white">Ready to build your presence?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of developers and professionals who trust Resumix.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                href="/dashboard"
                className="px-10 py-4 bg-primary text-primary-foreground text-lg rounded-full font-medium hover:bg-white hover:text-foreground transition-all shadow-lg hover:shadow-xl"
              >
                Get Started for Free
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-white/70 relative z-10">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> No Credit Card Required</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> SEO Optimized</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-serif font-bold text-foreground">Resumix</span>
            </div>
            <p className="text-muted-foreground text-sm">© 2025 Resumix. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
