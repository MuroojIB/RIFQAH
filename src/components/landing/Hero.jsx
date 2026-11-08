import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Sparkles } from 'lucide-react'
import { pill } from '@/utils/ui'
import { cn } from '@/utils/cn'
import { relativeDay } from '@/utils/format'

const WORD = [
  { letter: 'ر', bg: 'bg-cat-arts' },
  { letter: 'ف', bg: 'bg-cat-games' },
  { letter: 'ق', bg: 'bg-cat-sports' },
  { letter: 'ة', bg: 'bg-cat-learning' },
]

/** next: أقرب نشاط قادم (كائن toActivity) أو null — يظهر في البطاقة العائمة */
export default function Hero({ next }) {
  return (
    <section className="bg-grid-paper border-b border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col items-start gap-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-4 py-1.5 text-sm font-medium">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            «كل تجربة أحلى برفقة»
          </span>

          <h1 className="text-4xl font-bold leading-[1.25] tracking-tight md:text-6xl md:leading-[1.2]">
            اعثر على{' '}
            <span className="relative inline-block">
              <span aria-hidden="true" className="absolute inset-x-[-0.15em] bottom-[0.12em] -z-0 h-[0.45em] -rotate-1 rounded-md bg-cat-arts" />
              <span className="relative">رفقتك</span>
            </span>
            <br />
            وعيشوا التجربة{' '}
            <span className="relative inline-block">
              <span aria-hidden="true" className="absolute inset-x-[-0.15em] bottom-[0.12em] h-[0.45em] rotate-1 rounded-md bg-cat-sports" />
              <span className="relative">معاً</span>
            </span>
          </h1>

          <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            رِفقة منصة تجمعك بأشخاص يشاركونك اهتماماتك في مدينتك
            <br />
            اكتشف أنشطة قريبة منك، احجز مقعدك بضغطة، أو أنشئ
            نشاطك الخاص وادعُ الآخرين للانضمام
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/explore" className={pill({ size: 'lg' })}>
              استكشف الأنشطة
              <ArrowLeft aria-hidden="true" />
            </Link>
            <Link to="/create-activity" className={pill({ variant: 'outline', size: 'lg' })}>
              <Plus aria-hidden="true" />
              أنشئ نشاطاً
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="flex -space-x-2 space-x-reverse">
              {WORD.map((w) => (
                <span
                  key={w.letter}
                  className={cn(
                    'inline-flex size-10 items-center justify-center rounded-full font-display text-sm font-semibold ring-2 ring-background',
                    w.bg,
                  )}
                >
                  {w.letter}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">انضم اليوم، وكن من أوائل من يصنعون الرفقة في مدينتك</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-square -rotate-2 overflow-hidden rounded-[2rem] border-4 border-card shadow-xl shadow-foreground/10">
            <img
              src="/images/hero.webp"
              alt="رسم كولاج ورقي لمجموعة أصدقاء يضحكون معاً في الحديقة مع دراجة وقهوة ودفتر رسم"
              width="1024"
              height="1024"
              fetchPriority="high"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-3 rounded-sm bg-cat-learning/80"
          />
          {next && (
            <div className="absolute -bottom-5 -right-2 max-w-[16rem] rotate-2 rounded-2xl border border-foreground/10 bg-card px-4 py-3 shadow-lg md:-right-6">
              <p className="text-xs text-muted-foreground">{relativeDay(next.date)}</p>
              <p className="truncate font-display text-sm font-semibold">{next.title}</p>
            </div>
          )}
          <div className="absolute -left-2 top-10 -rotate-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg md:-left-6">
            ٦ فئات لتجد رفقتك
          </div>
        </div>
      </div>
    </section>
  )
}
