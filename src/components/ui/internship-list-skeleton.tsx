const CARD_COUNT = 5;

export function InternshipListSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-9 w-48 bg-gray-200 rounded-md animate-pulse" />
        <div className="mt-2 h-5 w-56 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-48 bg-gray-200 rounded" />
                  <div className="h-6 w-24 bg-gray-100 rounded-md" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-32 bg-gray-100 rounded" />
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                  <div className="h-4 w-28 bg-gray-100 rounded" />
                </div>
                <div className="h-4 w-36 bg-gray-100 rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-100 rounded-md" />
                  <div className="h-6 w-28 bg-gray-100 rounded-md" />
                </div>
                <div className="flex gap-1.5 pt-1">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-6 w-16 bg-gray-100 rounded" />
                  ))}
                </div>
              </div>
              <div className="h-16 w-16 rounded-full bg-gray-200 shrink-0" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-16 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
