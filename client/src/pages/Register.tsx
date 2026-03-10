import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout } from '@/components/Layout';
import { ComicCard, ComicButton, SectionTitle } from '@/components/ComicUI';
import { useCreateTeam } from '@/hooks/use-teams';
import { useToast } from '@/hooks/use-toast';
import { api } from '@shared/routes';
import { Plus, Trash2, Users } from 'lucide-react';
import { z } from 'zod';

type FormValues = z.infer<typeof api.teams.create.input>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutate: createTeam, isPending } = useCreateTeam();

  const form = useForm<FormValues>({
    resolver: zodResolver(api.teams.create.input),
    defaultValues: {
      name: '',
      domain: 'Agentic AI',
      problemStatement: '',
      lab: 'Lab A',
      githubRepo: '',
      figmaLink: '',
      members: [''],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members" as never, // cast due to generic typing limitations
  });

  const onSubmit = (data: FormValues) => {
    // Filter out empty members
    data.members = data.members.filter(m => m.trim() !== '');

    createTeam(data, {
      onSuccess: () => {
        toast({
          title: "BATTLE JOINED!",
          description: "Your team has successfully registered. Prepare for judgment.",
          variant: "default",
        });
        setLocation('/');
      },
      onError: (err) => {
        toast({
          title: "FATAL ERROR",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  const inputClass = "w-full comic-border p-4 text-xl font-heading bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ff1a1a]/20 transition-all";
  const labelClass = "block font-display text-2xl mb-2 uppercase";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <SectionTitle>TEAM CHECK-IN PANEL</SectionTitle>
        </div>

        <ComicCard className="bg-white">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Team Name */}
              <div>
                <label className={labelClass}>Team Name <span className="text-[#ff1a1a]">*</span></label>
                <input {...form.register('name')} className={inputClass} placeholder="e.g. Cyber Ninjas" />
                {form.formState.errors.name && <span className="text-[#ff1a1a] font-bold font-body">{form.formState.errors.name.message}</span>}
              </div>

              {/* Domain */}
              <div>
                <label className={labelClass}>Battle Domain <span className="text-[#ff1a1a]">*</span></label>
                <select {...form.register('domain')} className={inputClass}>
                  <option value="Agentic AI">Agentic AI</option>
                  <option value="Vibeathon">Vibeathon</option>
                  <option value="UI/UX Challenge">UI/UX Challenge</option>
                </select>
              </div>

              {/* Lab */}
              <div>
                <label className={labelClass}>Assigned Lab <span className="text-[#ff1a1a]">*</span></label>
                <select {...form.register('lab')} className={inputClass}>
                  <option value="Lab A">Lab A</option>
                  <option value="Lab B">Lab B</option>
                  <option value="Lab C">Lab C</option>
                  <option value="Lab D">Lab D</option>
                </select>
              </div>

              {/* GitHub / Figma Repository */}
              <div>
                <label className={labelClass}>
                  {form.watch('domain') === 'UI/UX Challenge' ? 'Figma Prototype Link' : 'GitHub Repo'} <span className="text-[#ff1a1a]">*</span>
                </label>
                <input
                  {...form.register('githubRepo')}
                  className={inputClass}
                  placeholder={form.watch('domain') === 'UI/UX Challenge' ? "https://figma.com/..." : "https://github.com/..."}
                />
                {form.formState.errors.githubRepo && <span className="text-[#ff1a1a] font-bold font-body">{form.formState.errors.githubRepo.message}</span>}
              </div>
            </div>

            {/* Problem Statement */}
            <div>
              <label className={labelClass}>Problem Statement <span className="text-[#ff1a1a]">*</span></label>
              <textarea
                {...form.register('problemStatement')}
                className={`${inputClass} min-h-[120px] resize-y`}
                placeholder="What world-ending problem does your tech solve?"
              />
              {form.formState.errors.problemStatement && <span className="text-[#ff1a1a] font-bold font-body">{form.formState.errors.problemStatement.message}</span>}
            </div>

            {/* Members */}
            <div className="p-6 border-4 border-black bg-gray-100 rounded-xl relative">
              <div className="absolute -top-6 -left-4 bg-[#ff1a1a] comic-border text-white px-4 py-1 font-display text-2xl rotate-[-5deg]">
                TEAM MEMBERS
              </div>

              <div className="space-y-4 mt-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-center">
                    <div className="flex-1 relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...form.register(`members.${index}` as const)}
                        className={`${inputClass} pl-12`}
                        placeholder={`Member ${index + 1} Name`}
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-black text-white p-4 comic-border hover:bg-[#ff1a1a] transition-colors"
                      >
                        <Trash2 size={24} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {fields.length < 3 ? (
                <button
                  type="button"
                  onClick={() => append("")}
                  className="mt-6 font-heading text-xl flex items-center gap-2 hover:text-[#ff1a1a] transition-colors"
                >
                  <Plus size={24} /> ADD MEMBER
                </button>
              ) : (
                <p className="mt-6 font-heading text-lg text-gray-500 italic">
                  MAX MEMBERS REACHED (3/3)
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-8 text-center">
              <ComicButton type="submit" size="lg" disabled={isPending} className="w-full md:w-auto">
                {isPending ? 'TRANSMITTING...' : 'INITIALIZE TEAM'}
              </ComicButton>
            </div>
          </form>
        </ComicCard>
      </div>
    </Layout>
  );
}
