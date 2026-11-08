import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { pill } from '@/utils/ui'

export default function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground md:px-16">
        <span aria-hidden="true" className="absolute -right-12 -top-12 size-48 rounded-full bg-cat-learning/25" />
        <span aria-hidden="true" className="absolute -bottom-16 -left-10 size-56 rounded-full bg-cat-arts/20" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 className="text-3xl font-bold md:text-5xl">عندك فكرة لنشاط؟</h2>
          <p className="text-pretty text-lg text-primary-foreground/85">
            جلسة قهوة، مباراة ودّية، أو ورشة صغيرة انشرها الآن ودع الرفقة تجدك
          </p>
          <Link to="/create-activity" className={pill({ variant: 'outline', size: 'lg' })}>
            <Plus aria-hidden="true" />
            أنشئ نشاطك الأول
          </Link>
        </div>
      </div>
    </section>
  )
}
