import React from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/Layout';
import { ComicButton, SpeechBubble } from '@/components/ComicUI';
import { Zap } from 'lucide-react';
import codeRequiem from '@assets/56060f72-97c8-42e8-87ae-bd19e6eb8446_1773053588366.jpg';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 relative z-10">
            <div className="absolute -top-12 -left-8 -rotate-12">
              <SpeechBubble className="animate-bounce">A NEW CHALLENGER APPEARS!</SpeechBubble>
            </div>
            
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-display leading-none drop-shadow-[4px_4px_0_#ff1a1a]">
              THE ULTIMATE <br/>
              <span className="text-white drop-shadow-[4px_4px_0_#000] -webkit-text-stroke-2 -webkit-text-stroke-black">HACKATHON</span><br/>
              ARENA
            </h1>
            
            <p className="font-body text-2xl font-bold max-w-xl bg-white/80 p-4 comic-border inline-block">
              Register your team, build the impossible, and face the judgment of the elders. Only the strongest code survives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <Link href="/register" className="inline-block">
                <ComicButton size="lg" variant="primary">
                  <Zap className="mr-2 h-8 w-8" /> MARK ATTENDANCE
                </ComicButton>
              </Link>
              <Link href="/judge-portal" className="inline-block">
                <ComicButton size="lg" variant="secondary">
                  JUDGE PORTAL
                </ComicButton>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-[#ff1a1a] comic-border translate-x-4 translate-y-4 rounded-3xl"></div>
            <img 
              src={codeRequiem} 
              alt="Manga Hackathon Battle" 
              className="relative z-10 w-full h-auto comic-border rounded-3xl object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
            />
            
            {/* Action text overlay */}
            <div className="absolute -bottom-8 -right-8 z-20 font-display text-8xl text-[#ff1a1a] drop-shadow-[4px_4px_0_#000] rotate-[-15deg]">
              CRASH!!
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  );
}
