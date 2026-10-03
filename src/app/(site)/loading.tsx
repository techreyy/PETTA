export default function SiteLoading() {
  return (
    <div
      className="min-h-[65vh] w-full flex flex-col items-center justify-center py-24 px-6 select-none"
      role="status"
      aria-live="polite"
      aria-label="Memuat halaman"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Architectural hairline circle loader */}
        <div className="relative w-11 h-11 flex items-center justify-center">
          {/* Static structural guide track */}
          <div className="absolute inset-0 rounded-full border border-[#E5E2DC]" />
          {/* Rotating hairline arc */}
          <div className="absolute inset-0 rounded-full border-[1.5px] border-transparent border-t-[#6A9D94] border-r-[#6A9D94]/30 rounded-full animate-spin [animation-duration:900ms]" />
          {/* Center architectural pivot point */}
          <div className="w-1.5 h-1.5 rounded-full bg-[#14191E]/75" />
        </div>

        {/* Minimal studio tracking label */}
        <div className="mt-4 flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#6B7785]">
            Memuat
          </span>
          <div className="w-5 h-[1px] bg-[#6A9D94]/40" />
        </div>
      </div>
      <span className="sr-only">Memuat konten halaman...</span>
    </div>
  );
}
