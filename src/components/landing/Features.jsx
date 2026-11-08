import { Compass, PencilLine, Users } from 'lucide-react'

const FEATURES = [
  {
    step: '01',
    title: 'اكتشف',
    body: 'تصفّح أنشطة قريبة منك حسب اهتماماتك، من جري الصباح إلى أندية القراءة وليالي الألعاب',
    icon: Compass,
    bg: 'bg-cat-games',
  },
  {
    step: '02',
    title: 'انضم',
    body: 'احجز مقعدك بضغطة واحدة، وتعرّف على المنظّم والمشاركين قبل أن تلتقي بهم',
    icon: Users,
    bg: 'bg-cat-arts',
  },
  {
    step: '03',
    title: 'أنشئ',
    body: 'عندك فكرة؟ حدّد الموعد والمكان وعدد المقاعد، وانشر نشاطك ليجد رفقته خلال دقائق',
    icon: PencilLine,
    bg: 'bg-cat-learning',
  },
]

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-semibold tracking-wide text-primary">كيف تعمل رِفقة؟</p>
        <h2 className="text-3xl font-bold md:text-4xl">لأن الأشياء الجميلة تصير أجمل مع الناس</h2>
        <p className="max-w-xl text-pretty text-muted-foreground">
          ثلاث خطوات بسيطة تفصلك عن تجربتك القادمة، ورفقة جديدة تستحق أن تُعرف
        </p>
      </div>

      <ul className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((f, i) => (
          <li
            key={f.title}
            className={`relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-foreground/10 p-7 ${f.bg} ${
              i === 1 ? 'md:translate-y-6' : ''
            }`}
          >
            <span aria-hidden="true" className="absolute -bottom-10 -left-10 size-40 rounded-full bg-card/30" />
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-foreground text-background">
                <f.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-sm font-semibold text-foreground/60">{f.step}</span>
            </div>
            <h3 className="text-2xl font-bold">{f.title}</h3>
            <p className="relative leading-relaxed text-foreground/80">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
