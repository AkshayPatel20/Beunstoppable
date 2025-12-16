import { calculateAchievements } from '../utils/calculateAchievements';


export default function AchievementsPage({ habits }) {
  const achievements = calculateAchievements(habits);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">🏆 Your Achievements</h2>
        <p className="text-slate-600">
          Unlocked <span className="font-bold text-indigo-600">{unlockedCount}</span> of {achievements.length} badges
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-slate-700">Overall Progress</span>
          <span className="text-slate-600">{((unlockedCount / achievements.length) * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Badges Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map(badge => (
          <div
            key={badge.id}
            className={`relative p-6 rounded-3xl border-2 transition-all duration-300 ${
              badge.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-xl hover:shadow-2xl hover:-translate-y-2'
                : 'bg-white/40 border-slate-200 opacity-60'
            }`}
          >
            {badge.unlocked && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4 ${
              badge.unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' : 'bg-slate-200'
            }`}>
              {badge.icon}
            </div>
            
            <h3 className={`text-lg font-bold mb-2 ${badge.unlocked ? 'text-slate-900' : 'text-slate-500'}`}>
              {badge.name}
            </h3>
            <p className={`text-sm ${badge.unlocked ? 'text-slate-600' : 'text-slate-400'}`}>
              {badge.description}
            </p>
            
            {!badge.unlocked && (
              <div className="mt-3 text-xs text-slate-500 font-semibold">
                🔒 Locked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
