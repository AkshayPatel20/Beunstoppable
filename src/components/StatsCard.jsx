
// ---------------------- STATS CARD ----------------------
export default function StatsCard({ icon, label, value, gradient }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center shadow-lg text-2xl`}>
          {icon}
        </div>
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
