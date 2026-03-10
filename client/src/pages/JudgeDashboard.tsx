import React from 'react';
import { Link, useLocation } from 'wouter';
import { Layout } from '@/components/Layout';
import { ComicCard, SectionTitle } from '@/components/ComicUI';
import { getJudgeId } from '@/hooks/use-auth';
import { Map, Users, Target } from 'lucide-react';
import questPanel from '@assets/image_1773053584081.png';

export default function JudgeDashboard() {
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!getJudgeId()) setLocation('/judge-portal');
  }, [setLocation]);

  const labs = [
    { id: 'Lab A', name: 'SECTOR ALPHA', color: '!bg-white text-black' },
    { id: 'Lab B', name: 'SECTOR BRAVO', color: '!bg-black text-white' },
    { id: 'Lab C', name: 'SECTOR CHARLIE', color: '!bg-white text-[#ff1a1a]' },
    { id: 'Lab D', name: 'SECTOR DELTA', color: '!bg-black text-[#ff1a1a]' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <SectionTitle>SELECT BATTLEFIELD</SectionTitle>
            <p className="font-body text-2xl font-bold mt-4 bg-black text-white p-2 inline-block comic-border rotate-1">
              CHOOSE A LAB TO EVALUATE TEAMS
            </p>
          </div>

          <img src={questPanel} alt="Quest" className="h-32 comic-border rotate-[-3deg] hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {labs.map((lab) => (
            <Link key={lab.id} href={`/judge/lab/${encodeURIComponent(lab.id)}`}>
              <ComicCard hoverEffect className={`cursor-pointer ${lab.color} h-full min-h-[200px] flex flex-col justify-between group overflow-hidden relative`}>

                <div className="absolute -right-12 -top-12 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Target size={180} />
                </div>

                <div className="relative z-10">
                  <span className="font-heading text-xl bg-black text-white px-3 py-1 comic-border">
                    {lab.id}
                  </span>
                  <h2 className="font-display text-6xl mt-4 drop-shadow-[2px_2px_0_#fff]">{lab.name}</h2>
                </div>

                <div className="flex justify-between items-center mt-8 relative z-10 font-heading text-2xl bg-white text-black p-4 comic-border group-hover:bg-[#ff1a1a] group-hover:text-white transition-colors">
                  <span className="flex items-center gap-2"><Users /> View Teams</span>
                  <Map />
                </div>
              </ComicCard>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
