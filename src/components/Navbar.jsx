// ---------------------- NAVBAR ----------------------
export default function Navbar({ user }) {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-2xl">
      <nav className="container mx-auto py-5 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Be Unstoppable
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-white/90 text-sm font-medium">{user.displayName}</p>
            <p className="text-white/60 text-xs">Keep building! 🚀</p>
          </div>
          <img
            src={user.photoURL || ""}
            alt="avatar"
            className="w-12 h-12 rounded-2xl border-3 border-white/30 shadow-xl ring-2 ring-white/20 hover:scale-105 transition-transform"
          />
        </div>
      </nav>
    </div>
  );
}
