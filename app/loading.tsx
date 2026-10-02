// Shown instantly while the next page's data loads, so navigation feels responsive.
export default function Loading() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-gold/20">
        <div className="h-full w-1/3 bg-gold animate-[loadingBar_1s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
