"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
const router = useRouter();
const [loading, setLoading] = useState(true);

useEffect(() => {
const checkSession = async () => {
const { data } = await supabase.auth.getSession();


  if (data.session) {
    router.push("/dashboard");
  } else {
    setLoading(false);
  }
};

checkSession();


}, [router]);

const handleLogin = async () => {
await supabase.auth.signInWithOAuth({
provider: "google",
});
};

if (loading)
return ( <div className="h-screen flex items-center justify-center bg-black text-white">
Loading... </div>
);

return ( <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white p-6">


  {/* Glow Background */}
  <div className="absolute w-[600px] h-[600px] bg-blue-500/20 blur-[180px] rounded-full" />

  {/* Glass Card */}
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 40 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl text-center max-w-md w-full space-y-8"
  >
    {/* Logo */}
    <div>
      <h1 className="text-4xl font-bold tracking-tight">
        LinkVault ✨
      </h1>
      <p className="text-gray-400 mt-3">
        Your personal secure bookmark vault
      </p>
    </div>

    {/* Login Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold px-6 py-4 rounded-xl hover:bg-gray-200 transition shadow-lg"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        className="w-5 h-5"
      />
      Continue with Google
    </motion.button>

    {/* Footer */}
    <p className="text-gray-500 text-sm">
      Secure • Private • Real-time Sync
    </p>
  </motion.div>
</main>


);
}
