import { Link } from 'react-router-dom'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="رِفقة - الصفحة الرئيسية">
      <span aria-hidden="true" className="relative flex size-9 items-center justify-center rounded-full bg-primary">
        <span className="absolute size-3.5 -translate-x-1.5 rounded-full bg-cat-learning" />
        <span className="absolute size-3.5 translate-x-1.5 rounded-full bg-cat-arts mix-blend-multiply" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-semibold">رِفقة</span>
        <span className="font-sans text-[10px] font-semibold tracking-[0.3em] text-muted-foreground">RIFQAH</span>
      </span>
    </Link>
  )
}

