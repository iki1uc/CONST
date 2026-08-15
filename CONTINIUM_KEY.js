// ======================================================
// CONTINIUM_KEY.js · Orbit + Atom + Singularität
// ======================================================

export const CONTINIUM_KEY = {

    orbitTokio(t) {
        return { x: Math.cos(t) * 2268, y: Math.sin(t) * 2268 };
    },

    orbitCorlu(t) {
        return { x: Math.cos(t) * 756, y: Math.sin(t) * 756 };
    },

    orbitHH(t) {
        return { x: Math.cos(t) * 243, y: Math.sin(t) * 243 };
    },

    pos(t) {
        return {
            x: Math.cos(t) * 2268,
            y: Math.sin(t) * 756,
            z: Math.sin(t * 1.33) * 243
        };
    },

    slideFrame(v) {
        return { x: v.x / 81, y: v.y / 81, z: v.z / 81 };
    },

    stability(v) {
        return (Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z)) / 9;
    },

    singularity(v) {
        const r = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return {
            radius: r,
            horizon: r * 0.33,
            collapse: r < 81 ? "EINZUG" : "STABIL"
        };
    },

    sequence() {
        return ["◉", "3", "9", "◎", "81", "◆", "△", "27", "▣", "3↺"];
    },

    skills: {
        tokio: "Orbit‑Intelligenz",
        corlu: "Drift‑Analyse",
        hh: "Hyperframe‑Geometrie"
    }
};

