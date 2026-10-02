export default function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className={className} aria-hidden="true">
      <path d="M0 5h14.5M10.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
