import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen pb-20">
      <div className="h-[50vh] w-full bg-muted animate-pulse" />
      
      <div className="container mx-auto px-4 relative -mt-32 z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <Skeleton className="h-[450px] w-[300px] rounded-lg" />
          </div>

          <div className="flex-1 pt-10 md:pt-32 space-y-6">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>

            <Skeleton className="h-16 w-3/4" />
            
            <div className="flex gap-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>

            <Skeleton className="h-32 w-full" />
            
            <div className="flex gap-4">
              <Skeleton className="h-14 w-40" />
              <Skeleton className="h-14 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
