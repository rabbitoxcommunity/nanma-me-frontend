export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-gradient-to-r from-cream via-pearl to-cream bg-[length:200%_100%] animate-[shimmer_1.6s_infinite_linear] rounded-sm ${className}`}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5] mb-5" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
