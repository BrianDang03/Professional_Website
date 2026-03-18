let cachedSimpleMotion = null;

export function shouldUseSimpleMotion() {
  if (cachedSimpleMotion !== null) {
    return cachedSimpleMotion;
  }

  if (typeof window === "undefined") {
    cachedSimpleMotion = false;
    return cachedSimpleMotion;
  }

  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const prefersDataSaver = Boolean(connection && connection.saveData);
  // ≤1 core = genuinely low-end single-core. Dual-core+ phones handle animations fine.
  const lowCoreDevice = (navigator.hardwareConcurrency || 8) <= 1;
  // ≤1 GB RAM = genuinely constrained. 2 GB and above can handle the animation.
  const lowMemoryDevice = (navigator.deviceMemory || 8) <= 1;

  cachedSimpleMotion = prefersReducedMotion || prefersDataSaver || lowCoreDevice || lowMemoryDevice;
  return cachedSimpleMotion;
}