const STEPS: { key: string; label: string }[] = [
  { key: "recue", label: "Reçue" },
  { key: "en_preparation", label: "En préparation" },
  { key: "en_livraison", label: "En livraison" },
  { key: "livree", label: "Livrée" },
];

export default function OrderStatusStepper({ status }: { status: string }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <ol className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <li key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  done ? "bg-brand text-white" : "bg-brand/10 text-brand/40"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`whitespace-nowrap text-[10px] font-medium uppercase tracking-wide ${
                  done ? "text-brand" : "text-brand/40"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1 mb-4 h-0.5 flex-1 ${
                  i < currentIndex ? "bg-brand" : "bg-brand/10"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
