export default function Loading() {
  return (
    <div className="p-8 max-w-[600px]">
      <div className="h-9 w-48 bg-surface-custom animate-pulse rounded-md mb-10" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-surface-custom animate-pulse rounded-md" />
        ))}
      </div>
    </div>
  );
}
