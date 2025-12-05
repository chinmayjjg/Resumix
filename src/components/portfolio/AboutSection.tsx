export default function AboutSection({ about, isDark }: { about: string; isDark: boolean }) {
  return (
    <section>
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>About Me</h2>
      <div className={`p-8 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50 border border-gray-100'}`}>
        <p className={`leading-loose text-lg ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{about}</p>
      </div>
    </section>
  );
}
