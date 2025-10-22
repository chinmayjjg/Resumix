export default function AboutSection({ about }: { about: string }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold border-b border-gray-200 pb-2 mb-3">About</h2>
      <p className="text-gray-700 leading-relaxed">{about}</p>
    </section>
  );
}
