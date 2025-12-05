import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);
    
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-400 to-blue-200 p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white space-y-6 px-4"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Build Consistency.
            <br />
            Build Your Daily Habits.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white">
              Become Unstoppable.
            </span>
          </h1>

          <p className="text-lg opacity-90 max-w-md">
            Be Unstoppable helps you Build your habits, maintain streaks,
            and grow a better version of yourself every single day.
          </p>

         
        </motion.div>

        {/* RIGHT LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md mx-auto"
        >
          <h2 className="text-3xl font-bold text-blue-900 text-center">
            Welcome to Be Unstoppable
          </h2>

          <p className="text-gray-700 text-center mt-2">
            Sign in to continue your journey
          </p>

          <button
            onClick={loginWithGoogle}
            className="mt-10 flex items-center justify-center w-full gap-3 py-3
                       bg-white/90 hover:bg-white transition rounded-xl shadow-md
                       hover:shadow-xl border border-gray-200 hover:border-blue-300"
          >
            <FcGoogle size={26} />
            <span className="text-gray-900 font-medium">Sign in with Google</span>
          </button>

          <p className="text-center text-xs text-gray-600 mt-6">
            By signing in, you agree to our Terms & Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
