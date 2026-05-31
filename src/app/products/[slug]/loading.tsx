function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className ?? ""}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2">
        <Bone className="h-3.5 w-10" />
        <Bone className="h-3.5 w-3" />
        <Bone className="h-3.5 w-16" />
        <Bone className="h-3.5 w-3" />
        <Bone className="h-3.5 w-40" />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <Bone className="aspect-[4/3] rounded-2xl" />

        {/* Details */}
        <div className="flex flex-col gap-5">
          <Bone className="h-4 w-20" />
          <Bone className="h-9 w-3/4" />
          <Bone className="h-5 w-36" />
          <Bone className="h-16 rounded-lg" />
          <Bone className="h-10 w-24" />
          <Bone className="h-4 w-44" />
          <Bone className="h-12 rounded-lg" />
          <Bone className="h-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
