export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
    >
      {/* Document border and fold */}
      <path d="M5 2v20h14V8l-6-6H5z" stroke="#374151" strokeWidth="2" />
      <path d="M13 2v6h6" stroke="#374151" strokeWidth="2" />

      {/* Row 1 */}
      <line x1="7" y1="12" x2="13" y2="12" stroke="#374151" strokeWidth="2" />
      <line x1="14.5" y1="12" x2="17" y2="12" stroke="#ef4444" strokeWidth="2" />

      {/* Row 2 */}
      <line x1="7" y1="15" x2="8.5" y2="15" stroke="#ef4444" strokeWidth="2" />
      <line x1="10" y1="15" x2="15" y2="15" stroke="#374151" strokeWidth="2" />
      {/* Red dot manually sized and positioned */}
      <circle cx="16.5" cy="15" r="1" fill="#ef4444" stroke="none" />

      {/* Row 3 */}
      <line x1="7" y1="18" x2="13" y2="18" stroke="#374151" strokeWidth="2" />
      <line x1="14.5" y1="18" x2="17" y2="18" stroke="#ef4444" strokeWidth="2" />
    </svg>
  );
}
