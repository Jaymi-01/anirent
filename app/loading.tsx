import { AnimeGridSkeleton } from "@/components/AnimeGridSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen animate-pulse">
      <div className="h-[600px] w-full bg-muted rounded-lg mb-8" />
      <div className="h-10 w-48 bg-muted rounded mb-8" />
      <AnimeGridSkeleton count={4} />
    </div>
  );
}
