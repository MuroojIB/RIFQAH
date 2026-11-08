import { Sparkles } from 'lucide-react'

// Layout shell for Login and Register pages
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <section className="bg-grid-paper">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-10 md:px-6 md:py-16 lg:grid-cols-[1fr_1.05fr]">
        <div className="mx-auto w-full max-w-md lg:max-w-lg">
          <div className="flex flex-col gap-7 rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-9">
            <header className="flex flex-col gap-2">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/15 bg-background px-3 py-1 text-xs font-medium">
                <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                «كل تجربة أحلى برفقة»
              </span>
              <h1 className="text-3xl font-bold">{title}</h1>
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </header>
            {children}
          </div>
          {footer && <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>}
        </div>

        <div aria-hidden="true" className="relative mx-auto hidden w-full max-w-md lg:block lg:max-w-none">
          <div className="relative aspect-square -rotate-2 overflow-hidden rounded-[2rem] border-4 border-card shadow-xl shadow-foreground/10">
            <img src="/images/hero.webp" alt="" className="absolute inset-0 size-full object-cover" />
          </div>
          <span className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-3 rounded-sm bg-cat-learning/80" />
        </div>
      </div>
    </section>
  )
}

