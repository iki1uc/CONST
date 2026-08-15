// Grundkonstanten
const G = 3;

// 1) pow sequence: [3^1, 3^2, ... 3^N]
function powSeq(base = G, maxLevel = 4){
  const out = [];
  for(let L=1; L<=maxLevel; L++) out.push(Math.pow(base, L));
  return out;
}

// 2) Expand a small matrix by Kronecker product (tile / replicate)
// input: smallMatrix: array of arrays (m x n), tileMatrix: e.g. [[1,1,1],[1,1,1],[1,1,1]] to expand 3->9
function kroneckerExpand(smallMatrix, tileMatrix){
  const m = smallMatrix.length, n = smallMatrix[0].length;
  const tm = tileMatrix.length, tn = tileMatrix[0].length;
  const out = [];
  for(let i=0;i<m;i++){
    for(let ii=0; ii<tm; ii++){
      const row = [];
      for(let j=0;j<n;j++){
        for(let jj=0;jj<tn;jj++){
          row.push(smallMatrix[i][j] * tileMatrix[ii][jj]);
        }
      }
      out.push(row);
    }
  }
  return out;
}

// Example tile generator: tile of ones sized base (makes simple upsample)
function onesTile(base = G){ return Array.from({length:base},()=>Array.from({length:base},()=>1)); }

// 3) Expand 3x3 -> 9x9 -> 27x27 etc by repeated kronecker
function expandToLevel(baseMatrix, levels=2, base=G){
  let mat = baseMatrix;
  for(let k=1;k<levels;k++){
    const tile = onesTile(base);
    mat = kroneckerExpand(mat, tile);
  }
  return mat;
}

// 4) Feature extraction per cell: compute score from provided resumes/confidences
function cellScoreFromResumes(resumes, qi, iqq, weights={qi:0.5,resume:0.3,role:0.2}){
  const confs = resumes.map(r=>r.conf || 0);
  const base = confs.reduce((a,b)=>a+b,0)/confs.length;
  const maxc = Math.max(...confs);
  const combined = Math.max(0, Math.min(1, qi*base + (1 - iqq)*maxc));
  return { base, maxc, combined };
}

// 5) Aggregate a matrix (2D) of numeric cell‑values to summary features
function aggregateMatrixStats(mat){
  const rows = mat.length, cols = mat[0].length;
  let sum=0, cnt=0, max=-Infinity, min=Infinity;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const v = Number(mat[r][c]) || 0;
      sum += v; cnt++;
      if(v>max) max=v;
      if(v<min) min=v;
    }
  }
  const mean = cnt?sum/cnt:0;
  return { rows, cols, mean, max, min, count:cnt };
}

// 6) Map scale/size -> TMP preset / weight
function mapScaleToTMP(size){
  // heuristic: small sizes -> 'calm', medium->'active', large->'orbit' or 'chaos'
  if(size <= 3) return 'calm';
  if(size <= 9) return 'active';
  if(size <= 27) return 'orbit';
  return 'chaos';
}

// 7) pipeline: start with 3x3 mask (values 0..1), expand to levels, compute per-level aggregates & fusion
function multiScalePipeline(baseMask, levels=3, qi=0.65, iqq=0.35){
  // baseMask is 3x3 numeric array
  const results = [];
  let mat = baseMask;
  for(let L=1; L<=levels; L++){
    const size = Math.pow(G, L);
    if(L>1) mat = expandToLevel(baseMask, L, G); // or expand progressively
    // compute a simple cell aggregation: here we compute mean of mat
    const agg = aggregateMatrixStats(mat);
    const tmp = mapScaleToTMP(size);
    // create a conservative level score (for demo we use mean * qi factor)
    const levelScore = Number((agg.mean * qi * (1 - iqq)).toFixed(4));
    results.push({ level:L, size, rows:agg.rows, cols:agg.cols, mean:agg.mean, tmp, levelScore });
  }
  // fusion across levels: conservative = min(levelScore), uncertainty = max(range) etc
  const levelScores = results.map(r=>r.levelScore);
  const final = {
    levelScores,
    conservativeArg: Number(Math.min(...levelScores).toFixed(4)),
    robustArg3te: Number(levelScores.reduce((a,b)=>a+b,0)/levelScores.length) // mean as robust
  };
  return { results, final };
}
