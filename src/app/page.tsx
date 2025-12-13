import Link from "next/link";
import { Sparkles, FileText, Palette, Globe, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden relative">

      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[100px] animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <main className="flex-grow pt-32 pb-20 px-6">
        <section className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">The Ultimate Portfolio Builder</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Turn Your Resume into a <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              Personal Website
            </span>
            <span className="ml-4 text-slate-900 dark:text-white">Instantly</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Stop coding from scratch. Upload your PDF resume and let our smart builder automatically format it into a stunning, shareable portfolio in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 bg-blue-600 text-white text-lg rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-2">
                Build My Portfolio <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-lg rounded-xl font-bold hover:bg-white dark:hover:bg-slate-800 transition-all hover:-translate-y-1"
            >
              Learn More
            </Link>
          </div>

          {/* Abstract UI Preview */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 dark:opacity-40"></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Palette className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Beautiful Themes Included</h3>
                <p className="text-slate-500">Select from Modern, Minimal, Creative, and more.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-6">Why Choose Resumix?</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to showcase your work professionally.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 text-2xl group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">One-Click Import</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Simply upload your PDF resume. Our smart system extracts your skills, experience, and projects instantly—no manual entry required.
                </p>
              </div>

              <div className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all duration-300">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 text-2xl group-hover:scale-110 transition-transform">
                  <Palette className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Premium Themes</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Choose from our curated collection of professional templates. Switch layouts instantly to match your personal brand.
                </p>
              </div>

              <div className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-green-500/30 transition-all duration-300">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400 text-2xl group-hover:scale-110 transition-transform">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Instant Hosting</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Get a unique <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm font-mono">/yourname</code> URL immediately. Perfect for sharing on LinkedIn and your resume.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <h2 className="text-4xl font-bold mb-6 relative z-10">Ready to build your presence?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of developers and professionals who trust Resumix for their online portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-white text-blue-600 text-lg rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg"
              >
                Get Started for Free
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-blue-100 opacity-80 relative z-10">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> No Credit Card Required</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> SEO Optimized</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Mobile Responsive</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="p-1.5 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-lg text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">Resumix</span>
            </div>
            <p className="text-slate-500 text-sm">© 2025 Resumix. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
