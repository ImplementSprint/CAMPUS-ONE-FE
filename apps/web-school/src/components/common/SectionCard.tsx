import type { PropsWithChildren } from 'react'

type SectionCardProps = PropsWithChildren<{
  title: string
  subtitle?: string
  className?: string
}>

export function SectionCard({ title, subtitle, children, className = '' }: SectionCardProps) {
  return (
    <section className={`section-card ${className}`.trim()}>
      <header className="section-card-head">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </header>
      <div>{children}</div>
    </section>
  )
}
