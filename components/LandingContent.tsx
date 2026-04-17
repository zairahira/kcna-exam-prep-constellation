"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import modulesData from "@/content/modules.json";
import { isComplete, resetProgress } from "@/lib/progress";
import ProgressBar from "./ProgressBar";

interface Step {
  slug: string;
  title: string;
  type: "lesson" | "debug" | "review" | "quiz";
}

interface Module {
  slug: string;
  title: string;
  domain: string;
  weight: string;
  steps: Step[];
}

const modules = modulesData.modules as Module[];

const domainColorMap: Record<string, string> = {
  "Kubernetes Fundamentals": "text-highlight border-highlight bg-highlight/5",
  "Container Orchestration": "text-accent border-accent bg-accent/5",
  "Cloud Native Architecture": "text-warning border-warning bg-warning/5",
  "Cloud Native Application Delivery": "text-danger border-danger bg-danger/5",
};

const IconTheory = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconDebug = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const IconQuiz = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

export default function LandingContent() {
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const map: Record<string, boolean> = {};
    for (const mod of modules) {
      for (const step of mod.steps) {
        const key = `${mod.slug}/${step.slug}`;
        map[key] = isComplete(key);
      }
    }
    setCompletions(map);
  }, []);

  if (!mounted) return null;

  const totalSteps = modules.reduce((n, m) => n + m.steps.length, 0);
  const totalDone = Object.values(completions).filter(Boolean).length;
  
  const modulesDone = modules.filter(mod => 
    mod.steps.every(s => completions[`${mod.slug}/${s.slug}`])
  ).length;

  let nextStep: { mod: Module; step: Step } | null = null;
  for (const mod of modules) {
    for (const step of mod.steps) {
      if (!completions[`${mod.slug}/${step.slug}`]) {
        nextStep = { mod, step };
        break;
      }
    }
    if (nextStep) break;
  }

  if (!nextStep) {
    nextStep = { mod: modules[0], step: modules[0].steps[0] };
  }

  const isNewUser = totalDone === 0;
  const isFinished = totalDone === totalSteps && totalSteps > 0;

  return (
    <div className="space-y-16">
      <section>
        <div className="max-w-3xl">
          <h1 className="text-6xl font-black mb-6 tracking-tighter bg-gradient-to-br from-fg to-muted bg-clip-text text-transparent">
            KCNA Exam Prep
          </h1>
          <p className="text-xl text-fg-secondary leading-relaxed mb-8">
            Master Kubernetes and Cloud Native foundations. High-fidelity theory, 
            hands-on debug challenges, and precision quizzes designed for the KCNA.
          </p>

          <div className="flex flex-wrap gap-x-12 gap-y-4 mb-10 text-sm mono text-muted">
            <div className="flex items-center gap-2">
              <span className="text-success">✔</span> {modules.length} Learning Modules
            </div>
            <div className="flex items-center gap-2">
              <span className="text-success">✔</span> Hands-on Debugging
            </div>
            <div className="flex items-center gap-2">
              <span className="text-success">✔</span> CNCF Ecosystem Map
            </div>
            <div className="flex items-center gap-2">
              <span className="text-success">✔</span> Official Exam Targets
            </div>
          </div>
        </div>

        {isFinished ? (
          <div className="p-8 cc-card border-success bg-success/5 space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🎉</span>
              <div>
                <p className="text-success font-bold text-xl leading-none mb-1">Course Completed!</p>
                <p className="text-fg-secondary">You&apos;ve finished all {totalSteps} steps across {modules.length} modules.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Link
                href={`/module/${modules[0].slug}/${modules[0].steps[0].slug}`}
                className="bg-success text-bg font-bold px-8 py-3 rounded-lg hover:opacity-90 transition whitespace-nowrap"
              >
                Review Curriculum
              </Link>
              <button 
                onClick={() => { if(confirm("Are you sure you want to reset all progress?")) { resetProgress(); window.location.reload(); } }}
                className="text-muted hover:text-danger transition text-xs mono underline decoration-dotted underline-offset-8"
              >
                Reset Progress
              </button>
            </div>
          </div>
        ) : !isNewUser ? (
          <div className="p-6 md:p-8 cc-card space-y-8 bg-surface/50 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <ProgressBar current={totalDone} total={totalSteps} label="Total Completion" />
                <p className="text-[10px] md:text-xs mono text-muted uppercase tracking-widest">
                  {modulesDone} of {modules.length} modules complete
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-6 border-t md:border-t-0 md:border-l border-surface-border pt-6 md:pt-0 md:pl-8">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted mono uppercase tracking-widest mb-1">Resume Point</p>
                  <p className="font-bold truncate text-base md:text-lg leading-tight">{nextStep.step.title}</p>
                  <p className="text-xs text-muted truncate">Module: {nextStep.mod.title}</p>
                </div>
                <Link
                  href={`/module/${nextStep.mod.slug}/${nextStep.step.slug}`}
                  className="bg-warning text-bg font-black px-5 py-3 md:px-6 md:py-4 rounded-lg hover:opacity-90 transition whitespace-nowrap shadow-lg shadow-warning/10 text-sm md:text-base w-full sm:w-auto text-center"
                >
                  Continue →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <Link
              href={`/module/${modules[0].slug}/${modules[0].steps[0].slug}`}
              className="bg-warning text-bg font-black px-10 py-5 rounded-xl text-xl hover:scale-[1.02] active:scale-95 transition-all inline-block shadow-xl shadow-warning/20"
            >
              Start Course →
            </Link>
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="cc-card p-8 group hover:border-accent transition-colors">
          <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <IconTheory />
          </div>
          <h3 className="font-bold text-xl mb-3">Clean Theory</h3>
          <p className="text-sm text-fg-secondary leading-relaxed">
            Deep dives into CNCF concepts, Kubernetes architecture, and
            cloud-native patterns. Built for the KCNA syllabus.
          </p>
        </div>
        <div className="cc-card p-8 group hover:border-warning transition-colors">
          <div className="w-12 h-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <IconDebug />
          </div>
          <h3 className="font-bold text-xl mb-3">Debug Scenarios</h3>
          <p className="text-sm text-fg-secondary leading-relaxed">
            Practical challenges where you diagnose broken clusters. Learn 
            how components fail before they do in production.
          </p>
        </div>
        <div className="cc-card p-8 group hover:border-success transition-colors">
          <div className="w-12 h-12 rounded-lg bg-success/10 text-success flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <IconQuiz />
          </div>
          <h3 className="font-bold text-xl mb-3">Precision Quizzes</h3>
          <p className="text-sm text-fg-secondary leading-relaxed">
            End-of-module assessments mapped to exam domains. Track your
            readiness across the 4 core syllabus areas.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-baseline justify-between gap-4 border-b border-surface-border pb-4">
          <h2 className="text-3xl font-black tracking-tight">Curriculum</h2>
          <span className="mono text-xs text-muted uppercase tracking-widest">{modules.length} Modules Total</span>
        </div>
        <div className="grid gap-4">
          {modules.map((mod, i) => {
            const isModComplete = mod.steps.every(s => completions[`${mod.slug}/${s.slug}`]);
            const domainClasses = domainColorMap[mod.domain] || "text-muted border-surface-border";
            const stepCounts = mod.steps.reduce((acc, s) => {
              acc[s.type] = (acc[s.type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            return (
              <Link
                key={mod.slug}
                href={`/module/${mod.slug}/${mod.steps[0].slug}`}
                className="cc-card p-6 flex flex-col md:flex-row md:items-center gap-6 hover:border-highlight transition group relative overflow-hidden"
              >
                {isModComplete && (
                  <div className="absolute top-0 right-0 p-1 bg-success text-bg text-[8px] mono font-bold uppercase tracking-tighter">
                    Complete
                  </div>
                )}
                <span className="mono text-muted text-sm w-8 opacity-50 group-hover:opacity-100 transition-opacity">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <p className="font-bold text-xl group-hover:text-highlight transition">
                      {mod.title}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded border mono uppercase font-bold tracking-wider ${domainClasses}`}>
                      {mod.domain}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs mono text-muted">
                    <span>{mod.weight} Weight</span>
                    <div className="flex items-center gap-3">
                      {stepCounts.lesson && <span>{stepCounts.lesson} Lessons</span>}
                      {stepCounts.debug && <span className="text-warning">1 Debug</span>}
                      {stepCounts.quiz && <span className="text-accent">1 Quiz</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted group-hover:text-highlight transition-colors ml-auto">
                  <span className="mono text-xs hidden md:block">START</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="pt-12 border-t border-surface-border flex flex-col md:flex-row justify-between gap-6 items-center text-center md:text-left">
        <p className="text-muted text-[10px] mono uppercase tracking-widest">
          &copy; {new Date().getFullYear()} KCNA Exam Prep
        </p>
      </footer>
    </div>
  );
}
