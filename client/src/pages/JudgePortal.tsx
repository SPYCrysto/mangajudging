import React from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout } from '@/components/Layout';
import { ComicCard, ComicButton, SpeechBubble } from '@/components/ComicUI';
import { useJudgeLogin, getJudgeId } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { api } from '@shared/routes';
import { z } from 'zod';
import elders from '@assets/image_1773053657274.png';
import { ShieldAlert } from 'lucide-react';

type LoginForm = z.infer<typeof api.auth.login.input>;

export default function JudgePortal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutate: login, isPending } = useJudgeLogin();

  // Redirect if already logged in
  React.useEffect(() => {
    if (getJudgeId()) {
      setLocation('/judge/dashboard');
    }
  }, [setLocation]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(api.auth.login.input),
    defaultValues: { username: '', password: '' }
  });

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: () => {
        toast({ title: "ACCESS GRANTED", description: "Welcome to the inner sanctum." });
        setLocation('/judge/dashboard');
      },
      onError: (err) => {
        toast({ title: "ACCESS DENIED", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1 relative">
            <div className="absolute top-10 -right-10 z-20">
              <SpeechBubble className="rotate-[5deg]">Identify yourself, overseer.</SpeechBubble>
            </div>
            <div className="comic-border p-2 bg-white rotate-[-2deg]">
              <img src={elders} alt="The Elders" className="w-full h-auto grayscale contrast-125" />
            </div>
          </div>

          <div className="flex-1 w-full">
            <ComicCard className="bg-[#ff1a1a] p-2">
              <div className="bg-white p-8 comic-border h-full flex flex-col justify-center">
                <h2 className="font-display text-5xl mb-2 flex items-center gap-4">
                  <ShieldAlert className="text-[#ff1a1a]" size={40} /> RESTRICTED AREA
                </h2>
                <p className="font-body text-xl text-gray-600 font-bold mb-8 uppercase">Elders & Judges Only</p>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block font-heading text-2xl mb-2">IDENTIFICATION (Username)</label>
                    <input 
                      {...form.register('username')} 
                      className="w-full comic-border p-4 text-2xl font-body bg-gray-50 focus:bg-yellow-50 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-2xl mb-2">PASSPHRASE (Password)</label>
                    <input 
                      type="password"
                      {...form.register('password')} 
                      className="w-full comic-border p-4 text-2xl font-body bg-gray-50 focus:bg-yellow-50 focus:outline-none" 
                    />
                  </div>
                  
                  <ComicButton type="submit" className="w-full mt-4" disabled={isPending}>
                    {isPending ? 'VERIFYING...' : 'AUTHORIZE'}
                  </ComicButton>
                </form>
              </div>
            </ComicCard>
          </div>
          
        </div>
      </div>
    </Layout>
  );
}
