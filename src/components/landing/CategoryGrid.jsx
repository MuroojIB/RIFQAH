import { Link } from 'react-router-dom'
import { ArrowUpLeft } from 'lucide-react'
import { CATEGORIES } from '@/utils/activities'

export default function CategoryGrid() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-3xl font-bold md:text-4xl">ماذا تحب أن تفعل؟</h2>
          <p className="text-muted-foreground">اختر فئة وابدأ الاستكشاف</p>
        </div>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                to={`/explore?category=${c.id}`}
                className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/10 ${c.bg}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-2 p-4 md:p-5">
                  <div>
                    <h3 className="text-base font-semibold md:text-lg">{c.label}</h3>
                    <p className="mt-1 hidden text-sm text-foreground/70 sm:block">{c.description}</p>
                  </div>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card transition-colors group-hover:bg-foreground group-hover:text-background">
                    <ArrowUpLeft className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
