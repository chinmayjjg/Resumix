import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Navbar */}
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-gray-100">
        <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span>Resumix</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</Link>
        </nav>
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-20 px-6 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Build Your Professional Portfolio in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop wasting time coding from scratch. Upload your resume and let our AI builder generate a stunning, shareable portfolio website for you instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white text-lg rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-300 transform hover:-translate-y-1"
            >
              Build My Portfolio
            </Link>
            <Link
              href="#demo"
              className="px-8 py-4 bg-white text-gray-700 border border-gray-200 text-lg rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              View Demo
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose Resumix?</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600 text-2xl">
                  📄
                </div>
                <h3 className="text-xl font-bold mb-3">One-Click Import</h3>
                <p className="text-gray-600">
                  Simply upload your PDF resume. We extract your skills, experience, and projects automatically.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-purple-600 text-2xl">
                  🎨
                </div>
                <h3 className="text-xl font-bold mb-3">Customizable Themes</h3>
                <p className="text-gray-600">
                  Choose from professional themes (Light/Dark) to match your personal brand and style.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 text-green-600 text-2xl">
                  🚀
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Hosting</h3>
                <p className="text-gray-600">
                  Get a unique public URL immediately. Share it with recruiters and on LinkedIn.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-bold text-white">Resumix</span>
            <p className="mt-2 text-sm">© 2024 Resumix. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
