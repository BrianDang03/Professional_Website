import React, { useMemo, useRef, useState } from "react";
import "./TiltFlipCard.css";

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
  const tiltRef = useRef(null);
  const rafRef = useRef(0);
  const [flipped, setFlipped] = useState(false);

  const pointerState = useRef({
    isDown: false,
    isHolding: false,
    moved: false,
    startX: 0,
    startY: 0,
    holdTimer: null,
    activePointerId: null
  });

  const HOLD_DELAY = 180;
  const MOVE_THRESHOLD = 8;

  const styleVars = useMemo(
    () => ({
      "--card-w": `${width}px`,
      "--card-h": `${height}px`,
      "--pop-out": `${popOut}px`,
    }),
    [width, height, popOut]
  );

  const setVars = (vars) => {
    const el = tiltRef.current;
    if (!el) return;

    for (const [k, v] of Object.entries(vars)) {
      el.style.setProperty(k, v);
    }
  };

  const clearHoldTimer = () => {
    const state = pointerState.current;
    if (state.holdTimer) {
      clearTimeout(state.holdTimer);
      state.holdTimer = null;
    }
  };

  const resetTilt = () => {
    cancelAnimationFrame(rafRef.current);

    setVars({
      "--hover": "0",
      "--rx": "0deg",
      "--ry": "0deg",
      "--glare-o": "0",
      "--glare-x": "50%",
      "--glare-y": "50%"
    });
  };

  const cleanupPointer = (e) => {
    clearHoldTimer();

    const el = tiltRef.current;
    const state = pointerState.current;

    if (el && e?.pointerId != null && el.hasPointerCapture?.(e.pointerId)) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch { }
    }

    state.isDown = false;
    state.isHolding = false;
    state.moved = false;
    state.activePointerId = null;

    resetTilt();
  };

  const updateTilt = (clientX, clientY) => {
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

      const gx = (x / rect.width) * 100;
      const gy = (y / rect.height) * 100;

      setVars({
        "--hover": "1",
        "--rx": `${tiltX}deg`,
        "--ry": `${tiltY}deg`,
        "--glare-x": `${gx}%`,
        "--glare-y": `${gy}%`,
        "--glare-o": "1"
      });
    });
  };

  const onPointerEnter = (e) => {
    if (e.pointerType === "mouse") {
      setVars({
        "--hover": "1",
        "--glare-o": "1"
      });
      updateTilt(e.clientX, e.clientY);
    }
  };

  const onPointerDown = (e) => {
    const el = tiltRef.current;
    if (!el) return;

    const state = pointerState.current;
    state.isDown = true;
    state.isHolding = false;
    state.moved = false;
    state.startX = e.clientX;
    state.startY = e.clientY;
    state.activePointerId = e.pointerId;

    if (e.pointerType === "touch" || e.pointerType === "pen") {
      el.setPointerCapture?.(e.pointerId);

      clearHoldTimer();
      state.holdTimer = setTimeout(() => {
        if (pointerState.current.isDown) {
          pointerState.current.isHolding = true;
          setVars({
            "--hover": "1",
            "--glare-o": "1"
          });
        }
      }, HOLD_DELAY);
    }
  };

  const onPointerMove = (e) => {
    const state = pointerState.current;

    if (e.pointerType === "mouse") {
      updateTilt(e.clientX, e.clientY);
      return;
    }

    if (!state.isDown || state.activePointerId !== e.pointerId) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

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

    if (e.pointerType === "mouse") {
      setFlipped((prev) => !prev);
      cleanupPointer(e);
      return;
    }

    const wasTap =
      state.isDown &&
      state.activePointerId === e.pointerId &&
      !state.isHolding &&
      !state.moved;

    if (wasTap) {
      setFlipped((prev) => !prev);
    }

    cleanupPointer(e);
  };

  const onPointerLeave = (e) => {
    if (e.pointerType === "mouse") {
      resetTilt();
    }
  };

  const onPointerCancel = (e) => {
    cleanupPointer(e);
  };

  return (
    <div
      className="tfc-scene"
      style={styleVars}
      onPointerEnter={onPointerEnter}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
      onLostPointerCapture={onPointerCancel}
    >
      <div ref={tiltRef} className="tfc-tilt">
        <div className={`tfc-flip ${flipped ? "is-flipped" : ""}`}>
          <div className="tfc-face tfc-front">
            {frontImg && (
              <img
                src={frontImg}
                alt="card background"
                className="card-bg-image"
              />
            )}
            <div className="tfc-glare" />
            <div className="card-overlay">
              <div className="tfc-content">{front}</div>
            </div>
          </div>

          <div className="tfc-face tfc-back">
            {backImg && (
              <img
                src={backImg}
                alt="card background"
                className="card-bg-image"
              />
            )}
            <div className="tfc-glare" />
            <div className="card-overlay">
              <div className="tfc-content">{back}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}