export default function MarqueeBanner({ text }: { text: string }) {
  const item = (
    <span className="mx-6 font-serif text-2xl font-semibold uppercase tracking-tight text-white sm:text-3xl">
      {text}
    </span>
  );

  return (
    <div className="overflow-hidden border-y border-white/10 bg-brand py-4">
      <div className="flex w-max animate-marquee">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="flex items-center">
            {item}
            <span className="text-white/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
