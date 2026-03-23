import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 10, label: "Yıllık Deneyim", suffix: "+" },
  { value: 500, label: "Tamamlanan Dosya", suffix: "+" },
  { value: 95, label: "Müvekkil Memnuniyeti", suffix: "%" },
  { value: 8, label: "Uzmanlık Alanı", suffix: "+" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target]);

  return (
    <div ref={ref} className="mb-2 font-display text-[clamp(36px,4vw,52px)] font-bold leading-none text-accent-light">
      {count}
      {suffix}
    </div>
  );
};

const StatsBar = () => {
  return (
    <div className="gradient-navy relative overflow-hidden py-12">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23b9975b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="section-container relative z-10">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="py-2 text-center">
              <Counter target={stat.value} suffix={stat.suffix} />
              <div className="text-sm tracking-wide text-primary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
