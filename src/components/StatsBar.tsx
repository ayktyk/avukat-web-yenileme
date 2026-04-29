import { useEffect, useRef } from "react";

const stats = [
  { value: 10, label: "Yıllık Deneyim", suffix: "+" },
  { value: 500, label: "Tamamlanan Dosya", suffix: "+" },
  { value: 95, label: "Müvekkil Memnuniyeti", suffix: "%" },
  { value: 8, label: "Uzmanlık Alanı", suffix: "+" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;
    let observer: IntersectionObserver | null = null;
    let started = false;

    const runAnimation = () => {
      if (started) return;
      started = true;

      const duration = 1500;
      const start = performance.now();

      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        // Direct DOM write — bypass React re-render to avoid 4×125-frame state churn
        el.textContent = `${value}${suffix}`;
        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        }
      };

      rafId = requestAnimationFrame(animate);
    };

    // Only start when visible
    if (typeof IntersectionObserver === "undefined") {
      runAnimation();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            runAnimation();
            observer?.disconnect();
          }
        },
        { rootMargin: "0px 0px 100px 0px" },
      );
      observer.observe(el);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [target, suffix]);

  return (
    <div
      ref={ref}
      className="mb-2 font-display text-[clamp(36px,4vw,52px)] font-bold leading-none text-accent-light"
    >
      0{suffix}
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
