import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { SectionTitle, ComicCard } from '@/components/ComicUI';
import { useTeams } from '@/hooks/use-teams';
import { useEvaluations } from '@/hooks/use-evaluations';
import { Trophy, Medal, Flame } from 'lucide-react';

export default function Leaderboard() {
  const { data: teams, isLoading: loadingTeams } = useTeams();
  const { data: evaluations, isLoading: loadingEvals } = useEvaluations();
  const [viewMode, setViewMode] = useState<'global' | 'lab'>('global');

  if (loadingTeams || loadingEvals) {
    return <Layout><div className="text-center py-24 font-display text-5xl">CALCULATING STANDINGS...</div></Layout>;
  }

  // Calculate scores
  const teamScores = teams?.map(team => {
    const teamEvals = evaluations?.filter(e => e.teamId === team.id) || [];
    // Average score across all judges who evaluated this team
    const avgScore = teamEvals.length > 0
      ? teamEvals.reduce((sum, e) => sum + e.totalScore, 0) / teamEvals.length
      : 0;

    return {
      ...team,
      avgScore: Number(avgScore.toFixed(1)),
      judgesCount: teamEvals.length
    };
  }) || [];

  // Sort global
  const globalLeaderboard = [...teamScores].sort((a, b) => b.avgScore - a.avgScore);

  // Group by Domain
  const domains = ['Agentic AI', 'Vibeathon', 'UI/UX Challenge'];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <SectionTitle className="text-6xl md:text-8xl">GLOBAL STANDINGS</SectionTitle>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setViewMode('global')}
            className={`font-heading text-2xl px-8 py-3 comic-border transition-all ${viewMode === 'global' ? 'bg-[#ff1a1a] text-white comic-shadow' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            DOMAIN KINGS
          </button>
          <button
            onClick={() => setViewMode('lab')}
            className={`font-heading text-2xl px-8 py-3 comic-border transition-all ${viewMode === 'lab' ? 'bg-[#ff1a1a] text-white comic-shadow' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            LAB SECTORS
          </button>
        </div>

        {viewMode === 'global' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {domains.map((domain, i) => {
              const domainTeams = globalLeaderboard.filter(t => t.domain === domain).slice(0, 5); // Top 5 per domain
              const colors = ['bg-black text-white', 'bg-[#ff1a1a] text-white', 'bg-black text-white'];

              return (
                <ComicCard key={domain} className="bg-white p-0 overflow-hidden">
                  <div className={`${colors[i]} border-b-4 border-black p-6 text-center`}>
                    <h2 className="font-display text-4xl flex items-center justify-center gap-2">
                      <Flame /> {domain}
                    </h2>
                  </div>

                  <div className="p-4 space-y-4">
                    {domainTeams.length === 0 ? (
                      <p className="text-center font-heading text-gray-400 py-8">NO CHALLENGERS YET</p>
                    ) : (
                      domainTeams.map((team, rank) => (
                        <div key={team.id} className="flex items-center gap-4 p-4 border-4 border-black rounded-xl bg-white hover:bg-gray-50 hover:-translate-y-1 transition-all">
                          <div className={`w-12 h-12 shrink-0 flex items-center justify-center font-display text-3xl border-4 border-black rounded-full comic-shadow ${rank === 0 ? 'bg-[#ff1a1a] text-white' : 'bg-white text-black'}`}>
                            {rank + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-2xl truncate">{team.name}</h3>
                            <p className="font-body font-bold text-gray-500 text-sm">Lab: {team.lab} | Evals: {team.judgesCount}</p>
                          </div>
                          <div className="font-display text-4xl text-[#ff1a1a]">
                            {team.avgScore > 0 ? team.avgScore : '-'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ComicCard>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {['Lab A', 'Lab B', 'Lab C', 'Lab D'].map(lab => {
              const labTeams = globalLeaderboard.filter(t => t.lab === lab);
              return (
                <ComicCard key={lab} className="bg-white">
                  <h2 className="font-display text-5xl mb-6 border-b-4 border-black pb-2">{lab} LEADERBOARD</h2>

                  <div className="space-y-4">
                    {labTeams.length === 0 ? (
                      <p className="text-center font-heading text-gray-400 py-4">NO CHALLENGERS YET</p>
                    ) : (
                      labTeams.map((team, rank) => (
                        <div key={team.id} className="flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-4 last:border-0">
                          <div className="flex items-center gap-4">
                            <span className={`font-display text-3xl shrink-0 w-10 h-10 flex items-center justify-center border-2 border-black rounded ${rank === 0 ? 'bg-[#ff1a1a] text-white comic-shadow-sm' :
                                rank < 5 ? 'bg-black text-white' :
                                  'text-gray-400 border-none'
                              }`}>
                              {rank + 1}
                            </span>
                            <div>
                              <h3 className="font-heading text-2xl">{team.name}</h3>
                              <span className="font-body font-bold text-sm px-2 py-1 bg-black text-white border-2 border-black rounded">{team.domain}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-display text-4xl">{team.avgScore > 0 ? team.avgScore : 'PENDING'}</div>
                            <div className="font-body text-sm text-gray-500 font-bold">{team.judgesCount} JUDGES</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ComicCard>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
