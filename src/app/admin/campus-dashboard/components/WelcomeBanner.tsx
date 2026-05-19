export function WelcomeBanner() {
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0B0F14] p-6 md:p-8">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#F59E0B] rounded-full opacity-5" />
        <div className="absolute top-1/2 -translate-y-1/2 right-8 w-40 h-40 bg-[#F59E0B] rounded-full opacity-8" />
        <div className="absolute -bottom-20 left-1/4 w-52 h-52 bg-[#F59E0B] rounded-full opacity-4" />
        <div className="absolute top-4 left-1/2 w-px h-full bg-gradient-to-b from-[#F59E0B]/10 to-transparent" />
      </div>

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-[#F59E0B]" />
            <span className="text-[#F59E0B] text-[10px] font-bold tracking-[0.2em] uppercase">
              Academic Year 2024–2025
            </span>
          </div>
          <h2 className="text-2xl md:text-[28px] font-black text-white leading-tight">
            {greeting},{' '}
            <span className="text-[#F59E0B]">Admin</span> 👋
          </h2>
          <p className="text-white/40 text-sm mt-1.5 max-w-md">
            Here&apos;s your campus overview for today. Semester 2 is currently in progress — Week 8 of 18.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/50 text-xs">All systems operational</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-white/30 text-xs">Last updated: just now</span>
          </div>
        </div>

        {/* Right: quick stats */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-center min-w-[76px]">
            <p className="text-[#F59E0B] font-black text-2xl leading-none">2nd</p>
            <p className="text-white/40 text-[10px] mt-1.5 font-medium uppercase tracking-wide">Semester</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-center min-w-[76px]">
            <p className="text-[#F59E0B] font-black text-2xl leading-none">Wk 8</p>
            <p className="text-white/40 text-[10px] mt-1.5 font-medium uppercase tracking-wide">of 18</p>
          </div>
          <div className="bg-[#F59E0B] rounded-2xl px-5 py-3.5 text-center min-w-[76px] shadow-lg shadow-[#F59E0B]/20">
            <p className="text-black font-black text-2xl leading-none">87%</p>
            <p className="text-black/50 text-[10px] mt-1.5 font-bold uppercase tracking-wide">Attendance</p>
          </div>
        </div>
      </div>
    </div>
  )
}
