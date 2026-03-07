const formatCount = (value) => {
  if (value >= 10000) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US").format(value);
};

const revealElements = document.querySelectorAll(".reveal");
const countElements = document.querySelectorAll(".count[data-count]");

const animateCount = (element) => {
  const target = Number(element.dataset.count);
  if (Number.isNaN(target) || element.dataset.animated === "true") {
    return;
  }

  element.dataset.animated = "true";

  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) * (1 - progress);
    const currentValue = Math.round(target * eased);
    element.textContent = formatCount(currentValue);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = formatCount(target);
    }
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");

      if (entry.target.classList.contains("count")) {
        animateCount(entry.target);
      }

      const nestedCounters = entry.target.querySelectorAll?.(".count[data-count]");
      nestedCounters?.forEach(animateCount);

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => observer.observe(element));
countElements.forEach((element) => observer.observe(element));

document.getElementById("year").textContent = new Date().getFullYear();
