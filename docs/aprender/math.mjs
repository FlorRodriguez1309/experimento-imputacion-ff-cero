// All examples in these helpers are illustrative, not customer-level research data.
export function forwardFill(values, limit = Infinity) {
  let last = null, gap = 0;
  return values.map(v => {
    if (v !== null) { last = v; gap = 0; return v; }
    gap += 1;
    return gap <= limit ? last : null;
  });
}
export function median(values) {
  const a = values.filter(v => v !== null).slice().sort((a,b) => a-b);
  if (!a.length) return null;
  const i = Math.floor(a.length/2);
  return a.length%2 ? a[i] : (a[i-1]+a[i])/2;
}
export function auc(items) {
  const positives = items.filter(r => r.y === 1), negatives = items.filter(r => r.y === 0);
  let wins = 0;
  for(const p of positives) for(const n of negatives) wins += p.score > n.score ? 1 : p.score === n.score ? .5 : 0;
  return {value:wins/(positives.length*negatives.length),wins,total:positives.length*negatives.length};
}
export function gain(captured,n) { return captured*1100000-n*27500; }
export function holm(pvalues) {
  const ordered = pvalues.map((p,i)=>({p,i})).sort((a,b)=>a.p-b.p), result=[];
  let previous = 0;
  ordered.forEach(({p,i},rank)=> {previous=Math.min(1,Math.max(previous,p*(ordered.length-rank)));result[i]=previous;});
  return result;
}
