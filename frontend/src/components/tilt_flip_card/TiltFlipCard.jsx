import React, { useMemo, useRef, useState } from "react";
import "./TiltFlipCard.css";

export default function TiltFlipCard({
  img,
  front,
  back,
  width = 320,
  height = 420,
  maxTilt = 12
}) {
  const cardRef = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const rafRef = useRef(0);

  const styleVars = useMemo(() => ({
    "--card-w": `${width}px`,
    "--card-h": `${height}px`,
  }), [width, height]);

  const setVars = (vars) => {
    const el = cardRef.current;
    if (!el) return;
    for (const [k,v] of Object.entries(vars)) {
      el.style.setProperty(k,v);
    }
  };

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const nx = x / rect.width - 0.5;
      const ny = y / rect.height - 0.5;

      const tiltX = -ny * maxTilt;
      const tiltY = nx * maxTilt;

      const gx = (x / rect.width) * 100;
      const gy = (y / rect.height) * 100;

      setVars({
        "--rx": `${tiltX}deg`,
        "--ry": `${tiltY}deg`,
        "--glare-x": `${gx}%`,
        "--glare-y": `${gy}%`,
        "--glare-o": "1"
      });

    });
  };

  const onEnter = () => setVars({ "--hover": "1", "--glare-o": "1" });

  const onLeave = () => {
    setVars({
      "--hover": "0",
      "--rx": "0deg",
      "--ry": "0deg",
      "--glare-o": "0"
    });
  };

  return (
    <div
      className="tfc-scene"
      style={styleVars}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        ref={cardRef}
        className={`tfc-card ${flipped ? "is-flipped" : ""}`}
      >
        <div className="tfc-face tfc-front">
          <div className="tfc-glare"/>
          <div className="tfc-content">{front}</div>
        </div>

        <div className="tfc-face tfc-back">
          <div className="tfc-glare"/>
          <div className="tfc-content">{back}</div>
        </div>

      </div>
    </div>
  );
}