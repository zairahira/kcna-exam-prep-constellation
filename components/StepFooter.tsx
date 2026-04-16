"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import modulesData from "@/content/modules.json";
import { markComplete, isComplete } from "@/lib/progress";

type StepType = "lesson" | "debug" | "review" | "quiz";

interface Step {
  slug: string;
  title: string;
  type: StepType;
}

interface Module {
  slug: string;
  title: string;
  steps: Step[];
}

const modules = modulesData.modules as Module[];

interface StepFooterProps {
  moduleSlug: string;
  stepSlug: string;
}

/**
 * Rendered at the bottom of every step page. Handles:
 *   - Marking the step complete (localStorage via lib/progress)
 *   - Navigating to the next step (within module, or first step of next module)
 *   - Showing a "Previous" link for backward navigation
 */
export default function StepFooter({ moduleSlug, stepSlug }: StepFooterProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  const key = `${moduleSlug}/${stepSlug}`;

  useEffect(() => {
    setCompleted(isComplete(key));
  }, [key]);

  const modIdx = modules.findIndex((m) => m.slug === moduleSlug);
  const mod = modules[modIdx];
  const stepIdx = mod?.steps.findIndex((s) => s.slug === stepSlug) ?? -1;

  if (!mod || stepIdx < 0) return null;

  // Resolve next destination
  let nextHref: string | null = null;
  let nextLabel = "Next step";
  let isEndOfCourse = false;

  if (stepIdx < mod.steps.length - 1) {
    const nextStep = mod.steps[stepIdx + 1];
    nextHref = `/module/${mod.slug}/${nextStep.slug}`;
    nextLabel = `Next: ${nextStep.title}`;
  } else if (modIdx < modules.length - 1) {
    const nextMod = modules[modIdx + 1];
    const nextStep = nextMod.steps[0];
    nextHref = `/module/${nextMod.slug}/${nextStep.slug}`;
    nextLabel = `Next module: ${nextMod.title}`;
  } else {
    isEndOfCourse = true;
  }

  // Resolve previous
  let prevHref: string | null = null;
  let prevLabel = "";
  if (stepIdx > 0) {
    const prevStep = mod.steps[stepIdx - 1];
    prevHref = `/module/${mod.slug}/${prevStep.slug}`;
    prevLabel = prevStep.title;
  } else if (modIdx > 0) {
    const prevMod = modules[modIdx - 1];
    const prevStep = prevMod.steps[prevMod.steps.length - 1];
    prevHref = `/module/${prevMod.slug}/${prevStep.slug}`;
    prevLabel = `${prevMod.title} - ${prevStep.title}`;
  }

  const handleCompleteAndContinue = () => {
    markComplete(key);
    setCompleted(true);
    if (nextHref) router.push(nextHref);
  };

  return (
    <footer className="max-w-3xl mx-auto px-8 pb-16 pt-2 mt-12">
      <div className="cc-card p-5 flex flex-wrap items-center justify-end gap-3">
        {!completed ? (
          <button
            type="button"
            onClick={handleCompleteAndContinue}
            className="bg-warning text-bg font-bold px-5 py-2 rounded hover:opacity-90 transition"
          >
            {nextHref ? "Mark complete & continue →" : "Mark complete"}
          </button>
        ) : (
          <>
            <span className="text-success mono text-sm flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success">
                <svg viewBox="0 0 12 12" className="w-3 h-3 text-bg" fill="none">
                  <path
                    d="M2.5 6l2.5 2.5 4.5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Completed
            </span>
            {isEndOfCourse ? (
              <span className="text-fg-secondary">
                You&apos;ve finished the course.
              </span>
            ) : nextHref ? (
              <Link
                href={nextHref}
                className="bg-highlight text-bg font-bold px-5 py-2 rounded hover:opacity-90 transition"
              >
                {nextLabel} →
              </Link>
            ) : null}
          </>
        )}
      </div>

      <nav className="mt-4 flex items-center justify-between text-sm text-muted mono">
        {prevHref ? (
          <Link
            href={prevHref}
            className="hover:text-highlight truncate max-w-[48%]"
            title={prevLabel}
          >
            ← {prevLabel}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/" className="hover:text-highlight">
          Course Home
        </Link>
      </nav>
    </footer>
  );
}
