// ── Boot sequencing constants ─────────────────────────────────────────────
export const BOOT_MIN_DELAY_MS = 420;
export const BOOT_ASSET_TIMEOUT_MS = 1800;

export const BOOT_IMAGES = ["modem.jpg", "headshot.jpg", "contact.png", "flipIcon.png"];

export const ROUTE_PRELOADERS = [
    () => import("../pages/About/About"),
    () => import("../pages/Portfolio/Portfolio"),
];

// ── Utilities ─────────────────────────────────────────────────────────────
export function withTimeout(promise, timeoutMs) {
    return Promise.race([
        promise,
        new Promise((resolve) => window.setTimeout(resolve, timeoutMs)),
    ]);
}

export function preloadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        let settled = false;
        const done = () => {
            if (!settled) {
                settled = true;
                resolve();
            }
        };
        img.onload = done;
        img.onerror = done;
        img.src = src;
        if (typeof img.decode === "function") {
            img.decode().then(done).catch(done);
        }
    });
}
