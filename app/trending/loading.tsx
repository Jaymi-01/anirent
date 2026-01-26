import { AnimeGridSkeleton } from "@/components/AnimeGridSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-10 space-y-4">
        <div className="h-10 w-64 bg-muted rounded animate-pulse" />
        <div className="h-6 w-96 bg-muted rounded animate-pulse" />
      </div>
      <AnimeGridSkeleton count={12} />
    </div>
  );
}
