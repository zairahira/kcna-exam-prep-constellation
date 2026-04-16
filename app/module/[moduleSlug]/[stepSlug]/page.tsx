import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import StepFooter from "@/components/StepFooter";
import modulesData from "@/content/modules.json";

export function generateStaticParams() {
  const params: { moduleSlug: string; stepSlug: string }[] = [];
  for (const mod of modulesData.modules) {
    for (const step of mod.steps) {
      params.push({ moduleSlug: mod.slug, stepSlug: step.slug });
    }
  }
  return params;
}

export default async function StepPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; stepSlug: string }>;
}) {
  const { moduleSlug, stepSlug } = await params;

  const mod = modulesData.modules.find((m) => m.slug === moduleSlug);
  if (!mod) notFound();

  const step = mod.steps.find((s) => s.slug === stepSlug);
  if (!step) notFound();

  let Content;
  try {
    Content = (
      await import(`@/content/${moduleSlug}/${stepSlug}.mdx`)
    ).default;
  } catch {
    // MDX file doesn't exist yet - render a placeholder
    Content = null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <nav className="max-w-3xl mx-auto px-8 pt-6 pb-2">
          <Link 
            href="/" 
            className="text-muted text-[10px] mono hover:text-highlight transition flex items-center gap-1.5 group tracking-widest"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO HOME
          </Link>
        </nav>
        {Content ? (
          <Content />
        ) : (
          <div className="max-w-3xl mx-auto px-8 py-10">
            <div className="cc-card p-6 text-center">
              <p className="mono text-muted text-sm mb-2">{step.type}</p>
              <h1 className="text-2xl font-bold mb-2">{step.title}</h1>
              <p className="text-fg-subtle">
                Content coming soon.
              </p>
            </div>
          </div>
        )}
        <StepFooter moduleSlug={moduleSlug} stepSlug={stepSlug} />
      </main>
    </div>
  );
}
