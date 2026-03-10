import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { LogOut, Home, Swords, Trophy } from 'lucide-react';
import { getJudgeId, useJudgeLogout } from '@/hooks/use-auth';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const judgeId = getJudgeId();
  const { mutate: logout } = useJudgeLogout();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-60">
        <div className="absolute inset-0 speed-lines opacity-20"></div>
      </div>

      <header className="border-b-4 border-black bg-white sticky top-0 z-50 comic-shadow">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="font-display text-4xl text-[#ff1a1a] hover:-rotate-2 hover:scale-105 transition-transform inline-block">
            BATTLE<span className="text-black">HACK</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="font-heading text-xl hover:text-[#ff1a1a] transition-colors flex items-center gap-2">
              <Home size={20} /> HOME
            </Link>
            <Link href="/judge/leaderboard" className="font-heading text-xl hover:text-[#ff1a1a] transition-colors flex items-center gap-2">
              <Trophy size={20} /> STANDINGS
            </Link>
            
            {judgeId ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l-4 border-black">
                <Link href="/judge/dashboard" className="font-heading text-xl text-[#ff1a1a] flex items-center gap-2">
                  <Swords size={20} /> PORTAL
                </Link>
                <button 
                  onClick={() => logout()} 
                  className="font-heading text-xl hover:text-[#ff1a1a] flex items-center gap-2"
                >
                  <LogOut size={20} /> OUT
                </button>
              </div>
            ) : (
              <Link href="/judge-portal" className="font-heading text-xl bg-black text-white px-4 py-2 hover:bg-[#ff1a1a] transition-colors border-2 border-black rounded flex items-center gap-2">
                <Swords size={20} /> JUDGE LOGIN
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 relative">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 20, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t-4 border-black bg-black text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-heading text-2xl">© {new Date().getFullYear()} BATTLEHACK INITIATIVE</p>
          <p className="font-body mt-2 text-gray-400 font-bold">ALL SYSTEMS OPERATIONAL // PREPARE FOR BATTLE</p>
        </div>
      </footer>
    </div>
  );
}
