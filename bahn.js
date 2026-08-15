const base3x3 = [
  [1,0.8,0.6],
  [0.4,0.2,0.1],
  [0.5,0.7,0.9]
];
const out = multiScalePipeline(base3x3, 3, 0.72, 0.28);
console.log(out);
