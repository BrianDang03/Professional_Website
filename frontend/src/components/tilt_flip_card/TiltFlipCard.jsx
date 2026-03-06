import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./TiltFlipCard.css";

const HOLD_DELAY = 180;
const MOVE_THRESHOLD = 8;

const INITIAL_POINTER_STATE = {
  isDown: false,
  isHolding: false,
  moved: false,
  startX: 0,
  startY: 0,
  holdTimer: null,
  activePointerId: null
};

const INITIAL_VISUAL_STATE = {
  "--hover": "0",
  "--rx": "0deg",
  "--ry": "0deg",
  "--glare-o": "0",
  "--glare-x": "50%",
  "--glare-y": "50%",
  "--expand-x": "0px",
  "--expand-y": "0px",
  "--expand-scale": "1"
};

export default function TiltFlipCard({
  frontImg,
  front,
  backImg,
  back,
  width = 320,
  height = 420,
  maxTilt = 12,
  popOut = 18
}) {
  const sceneRef = useRef(null);
  const tiltRef = useRef(null);
  const rafRef = useRef(0);
  const pointerState = useRef({ ...INITIAL_POINTER_STATE });

  const [expanded, setExpanded] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const styleVars = useMemo(
    () => ({
      "--card-w": `${width}px`,
      "--card-h": `${height}px`,
      "--pop-out": `${popOut}px`
    }),
    [width, height, popOut]
  );

  const setVars = useCallback((vars) => {
    const el = tiltRef.current;
    if (!el) return;

    for (const [key, value] of Object.entries(vars)) {
      el.style.setProperty(key, value);
    }
  }, []);

  const clearHoldTimer = useCallback(() => {
    const state = pointerState.current;
    if (state.holdTimer) {
      clearTimeout(state.holdTimer);
      state.holdTimer = null;
    }
  }, []);

  const resetVisualState = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setVars(INITIAL_VISUAL_STATE);
  }, [setVars]);

  const resetPointerState = useCallback(() => {
    clearHoldTimer();
    pointerState.current = {
      ...INITIAL_POINTER_STATE
    };
  }, [clearHoldTimer]);

  const cleanupPointer = useCallback(
    (e) => {
      const el = tiltRef.current;

      if (el && e?.pointerId != null && el.hasPointerCapture?.(e.pointerId)) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {}
      }

      resetPointerState();

      if (!expanded) {
        resetVisualState();
      }
    },
    [expanded, resetPointerState, resetVisualState]
  );

  const updateTilt = useCallback(
    (clientX, clientY) => {
      if (expanded) return;

      const el = tiltRef.current;
      if (!el) return;

      cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const nx = x / rect.width - 0.5;
        const ny = y / rect.height - 0.5;

        const tiltX = -ny * maxTilt;
        const tiltY = nx * maxTilt;

        setVars({
          "--hover": "1",
          "--rx": `${tiltX}deg`,
          "--ry": `${tiltY}deg`,
          "--glare-x": `${(x / rect.width) * 100}%`,
          "--glare-y": `${(y / rect.height) * 100}%`,
          "--glare-o": "1"
        });
      });
    },
    [expanded, maxTilt, setVars]
  );

  const computeExpandedTransform = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const rect = scene.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const edgeGap = Math.min(48, viewportW * 0.06);
    const maxW = viewportW - edgeGap * 2;
    const maxH = viewportH - edgeGap * 2;

    const scale = Math.min(maxW / rect.width, maxH / rect.height, 2.2);

    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const dx = viewportW / 2 - cardCenterX;
    const dy = viewportH / 2 - cardCenterY;

    setVars({
      "--expand-x": `${dx}px`,
      "--expand-y": `${dy}px`,
      "--expand-scale": `${scale}`
    });
  }, [setVars]);

  const openInspect = useCallback(() => {
    computeExpandedTransform();

    requestAnimationFrame(() => {
      setExpanded(true);
      setFlipped(true);
    });

    setVars({
      "--hover": "0",
      "--rx": "0deg",
      "--ry": "0deg",
      "--glare-o": "0"
    });
  }, [computeExpandedTransform, setVars]);

  const closeInspect = useCallback(() => {
    setExpanded(false);
    setFlipped(false);
    resetVisualState();
    resetPointerState();
  }, [resetPointerState, resetVisualState]);

  useLayoutEffect(() => {
    if (!expanded) return;

    const handleResize = () => {
      computeExpandedTransform();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expanded, computeExpandedTransform]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && expanded) {
        closeInspect();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = expanded ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      cancelAnimationFrame(rafRef.current);
      clearHoldTimer();
    };
  }, [expanded, closeInspect, clearHoldTimer]);

  const onPointerEnter = (e) => {
    if (expanded || e.pointerType !== "mouse") return;

    setVars({
      "--hover": "1",
      "--glare-o": "1"
    });

    updateTilt(e.clientX, e.clientY);
  };

  const onPointerDown = (e) => {
    if (expanded) return;

    const el = tiltRef.current;
    if (!el) return;

    pointerState.current = {
      ...pointerState.current,
      isDown: true,
      isHolding: false,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      activePointerId: e.pointerId
    };

    if (e.pointerType === "touch" || e.pointerType === "pen") {
      el.setPointerCapture?.(e.pointerId);

      clearHoldTimer();
      pointerState.current.holdTimer = setTimeout(() => {
        if (!pointerState.current.isDown) return;

        pointerState.current.isHolding = true;
        setVars({
          "--hover": "1",
          "--glare-o": "1"
        });
      }, HOLD_DELAY);
    }
  };

  const onPointerMove = (e) => {
    if (expanded) return;

    const state = pointerState.current;

    if (e.pointerType === "mouse") {
      updateTilt(e.clientX, e.clientY);
      return;
    }

    if (!state.isDown || state.activePointerId !== e.pointerId) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const distance = Math.hypot(dx, dy);

    if (distance > MOVE_THRESHOLD) {
      state.moved = true;
      state.isHolding = true;
      clearHoldTimer();

      setVars({
        "--hover": "1",
        "--glare-o": "1"
      });
    }

    if (state.isHolding) {
      updateTilt(e.clientX, e.clientY);
    }
  };

  const onPointerUp = (e) => {
    const state = pointerState.current;

    if (expanded) return;

    if (e.pointerType === "mouse") {
      openInspect();
      cleanupPointer(e);
      return;
    }

    const wasTap =
      state.isDown &&
      state.activePointerId === e.pointerId &&
      !state.isHolding &&
      !state.moved;

    if (wasTap) {
      openInspect();
    }

    cleanupPointer(e);
  };

  const onPointerLeave = (e) => {
    if (expanded) return;
    if (e.pointerType === "mouse") {
      resetVisualState();
    }
  };

  const onPointerCancel = (e) => {
    cleanupPointer(e);
  };

  return (
    <>
      {expanded && <div className="tfc-backdrop" onClick={closeInspect} />}

      <div
        ref={sceneRef}
        className={`tfc-scene ${expanded ? "is-expanded" : ""}`}
        style={styleVars}
        onPointerEnter={onPointerEnter}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        onPointerCancel={onPointerCancel}
        onLostPointerCapture={onPointerCancel}
      >
        <div
          ref={tiltRef}
          className={`tfc-tilt ${expanded ? "is-expanded" : ""}`}
        >
          <div
            className={`tfc-flip ${flipped ? "is-flipped" : ""} ${expanded ? "is-expanded" : ""}`}
          >
            <div className="tfc-face tfc-front">
              {frontImg && (
                <img
                  src={frontImg}
                  alt="card background"
                  className="card-bg-image"
                  loading="lazy"
                  decoding="async"
                />
              )}

              {!expanded && <div className="tfc-glare" />}

              {!expanded && (
                <div className="card-overlay">
                  <div className="tfc-content">{front}</div>
                </div>
              )}
            </div>

            <div className={`tfc-face tfc-back ${expanded ? "tfc-back-expanded" : ""}`}>
              {backImg && (
                <img
                  src={backImg}
                  alt="card background"
                  className="card-bg-image"
                  loading="lazy"
                  decoding="async"
                />
              )}

              {!expanded && <div className="tfc-glare" />}

              <div className={`card-overlay ${expanded ? "back-overlay" : ""}`}>
                {expanded && (
                  <button
                    className="tfc-close-btn"
                    onClick={closeInspect}
                    aria-label="Close expanded card"
                    type="button"
                  >
                    <span>x</span>
                  </button>
                )}

                <div className={`tfc-content ${expanded ? "tfc-scroll-content" : ""}`}>
                  {back}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}