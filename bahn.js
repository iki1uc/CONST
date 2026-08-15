// bahn.js
// Minimal Bahn (orbit) helper module for WELT

// simple orbit tick function (keeps same signature as previous orbitTick)
export function orbitTick(dt, state = {}) {
  // state can carry phase/angle
  state.phase = (state.phase || 0) + (dt * (state.speed || 1.0));
  // returns small delta object used by main loop if needed
  return { phase: state.phase, angle: (state.phase * 180 / Math.PI) % 360 };
}

// path generator: returns path params for visualization
export function makeOrbitPath(params = { x:0, y:0, z:0, radius:110, speed:1.0 }) {
  return {
    centerX: params.x, centerY: params.y, radius: params.radius, speed: params.speed
  };
}

export function renderOrbitOnCanvas(ctx, orbit, t){
  // simple canvas render helper: draws a ring with pulse
  ctx.save();
  ctx.translate(ctx.canvas.width/2, 130);
  ctx.strokeStyle = `rgba(108,204,255,${0.15 + (orbit.pulse||0)*0.6})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0,0,orbit.radius || 110,0,Math.PI*2);
  ctx.stroke();
  ctx.restore();
}

export default { orbitTick, makeOrbitPath, renderOrbitOnCanvas };
