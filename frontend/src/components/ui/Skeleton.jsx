export default function Skeleton({ className = 'h-16' }) {
  return <div className={`animate-pulse rounded-xl bg-line dark:bg-night-line ${className}`} />
}
