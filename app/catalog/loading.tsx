import { AnimeGridSkeleton } from "@/components/AnimeGridSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="space-y-2">
           <div className="h-8 w-48 bg-muted rounded animate-pulse" />
           <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-full md:w-80 bg-muted rounded animate-pulse" />
      </div>
      <AnimeGridSkeleton count={12} />
    </div>
  );
}
