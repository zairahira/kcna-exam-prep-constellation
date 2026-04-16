"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import modulesData from "@/content/modules.json";
import ProgressCircle from "./ProgressCircle";
import StepLabel from "./StepLabel";
import { isComplete } from "@/lib/progress";
import { useTimer } from "@/lib/timer-context";
import PomodoroTimer from "./PomodoroTimer";

type StepType = "lesson" | "debug" | "review" | "quiz";

interface Step {
  slug: string;
  title: string;
  type: StepType;
}

interface Module {
  slug: string;
  title: string;
  domain: string;
  weight: string;
  steps: Step[];
}

const modules = modulesData.modules as Module[];

function parsePath(pathname: string | null) {
  const m = pathname?.match(/^\/module\/([^/]+)\/([^/]+)/);
  return {
    activeModuleSlug: m?.[1] ?? null,
    activeStepSlug: m?.[2] ?? null,
  };
}

export default function Sidebar() {
  const pathname = usePathname();
  const { activeModuleSlug, activeStepSlug } = parsePath(pathname);

  // Set of open module slugs. Seeded with the active module so it starts open,
  // and auto-adds when the user navigates to a different module. But toggling
  // still works freely - the user can collapse the active module if they want.
  const [openModules, setOpenModules] = useState<Set<string>>(
    () => new Set(activeModuleSlug ? [activeModuleSlug] : []),
  );
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const activeStepRef = useRef<HTMLAnchorElement>(null);

  // Refresh completion state whenever the route changes.
  useEffect(() => {
    const map: Record<string, boolean> = {};
    for (const mod of modules) {
      for (const step of mod.steps) {
        const key = `${mod.slug}/${step.slug}`;
        map[key] = isComplete(key);
      }
    }
    setCompletions(map);
  }, [pathname]);

  // When the active MODULE changes (i.e. cross-module navigation), auto-open
  // the new one. Dep is activeModuleSlug - not pathname - so navigating
  // between steps of the same module won't re-open a module the user just
  // collapsed.
  useEffect(() => {
    if (!activeModuleSlug) return;
    setOpenModules((prev) => {
      if (prev.has(activeModuleSlug)) return prev;
      const next = new Set(prev);
      next.add(activeModuleSlug);
      return next;
    });
  }, [activeModuleSlug]);

  // Scroll the active step into view on navigation.
  useEffect(() => {
    activeStepRef.current?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  const toggleModule = (slug: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const isModuleOpen = (slug: string) => openModules.has(slug);

  const totalSteps = modules.reduce((n, m) => n + m.steps.length, 0);
  const totalDone = Object.values(completions).filter(Boolean).length;
  const { isEnabled, toggleEnabled } = useTimer();

  return (
    <aside
      className="w-80 shrink-0 bg-bg-2 border-r border-surface-border min-h-screen px-4 py-6 overflow-y-auto sticky top-0 max-h-screen"
      aria-label="Curriculum navigation"
    >
      <Link href="/" className="flex items-center gap-2 group mb-8 py-2 px-1 hover:text-highlight transition">
        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
        <div>
          <p className="font-bold text-lg leading-tight">KCNA Exam Prep</p>
          <p className="mono text-[10px] text-muted">
            {totalDone} of {totalSteps} steps complete
          </p>
        </div>
      </Link>

      <div className="mb-8 px-2">
        <button 
          onClick={toggleEnabled}
          className={`text-[10px] mono uppercase tracking-widest flex items-center gap-2 transition-colors ${isEnabled ? "text-highlight font-bold" : "text-muted hover:text-fg-subtle"}`}
        >
          <span className={`w-2 h-2 rounded-full ${isEnabled ? "bg-highlight animate-pulse" : "bg-surface-border"}`} />
          Focus Mode: {isEnabled ? "ON" : "OFF"}
        </button>
        <PomodoroTimer />
      </div>

      <nav>
        {modules.map((mod, modIdx) => {
          const open = isModuleOpen(mod.slug);
          const isActiveModule = mod.slug === activeModuleSlug;
          const modDone = mod.steps.filter(
            (s) => completions[`${mod.slug}/${s.slug}`],
          ).length;
          const allDone = modDone === mod.steps.length;

          return (
            <div key={mod.slug} className="mb-1">
              <button
                type="button"
                onClick={() => toggleModule(mod.slug)}
                className={`w-full text-left flex items-center gap-2 py-2 px-2 rounded transition text-sm border-l-2 ${
                  isActiveModule
                    ? "bg-surface border-l-accent text-fg"
                    : "border-l-transparent hover:bg-surface/60"
                }`}
                aria-expanded={open}
              >
                <span className="text-muted text-xs w-3">
                  {open ? "▾" : "▸"}
                </span>
                <ProgressCircle completed={allDone} size="md" />
                <span className="flex-1 min-w-0">
                  <span className="font-bold">
                    Module {modIdx + 1}:
                  </span>{" "}
                  <span>{mod.title}</span>
                </span>
                <span
                  className={`mono text-[10px] whitespace-nowrap ${
                    isActiveModule ? "text-fg-subtle" : "text-muted"
                  }`}
                >
                  {modDone}/{mod.steps.length}
                </span>
              </button>

              {open && (
                <ul className="ml-2 border-l border-surface-border">
                  {mod.steps.map((step) => {
                    const href = `/module/${mod.slug}/${step.slug}`;
                    const isActiveStep =
                      isActiveModule && step.slug === activeStepSlug;
                    const done =
                      completions[`${mod.slug}/${step.slug}`] ?? false;

                    return (
                      <li key={step.slug}>
                        <Link
                          ref={isActiveStep ? activeStepRef : null}
                          href={href}
                          className={`flex items-center gap-2 py-1.5 pl-3 pr-2 text-sm transition border-l-2 -ml-px ${
                            isActiveStep
                              ? "bg-surface border-l-accent text-fg font-medium"
                              : "border-l-transparent text-fg-secondary hover:text-fg hover:bg-surface/50"
                          }`}
                          aria-current={isActiveStep ? "page" : undefined}
                        >
                          <ProgressCircle completed={done} />
                          <span className="flex-1 truncate">{step.title}</span>
                          <StepLabel type={step.type} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
