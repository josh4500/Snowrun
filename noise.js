const lerp = (a, b, t) => a + (b - a) * t;
const fade = t => t*t*t*(t*(t*6-15)+10);

function Gradient(x){

    return (y)=>{
        return (z)=>{

        }
    }
}
function dotGridGradient(ix, iy, x, y){
    let dx = x - ix;
    let dy = y - iy;

    return(dx * Gradient(iy)(ix)(0) + dy* Gradient(iy)(ix)(0));
}

function perlin2D(x, y){
    let x0 = x;
    let x1 = x0 + 1;
    let y0 = y;
    let y1 = y0 + 1;

    let sx = fade(x);
    let sy = fade(y);

    let n0, n1, ix0, ix1, value;

    n0 = dotGridGradient(x0, y0, x, y);
    n1 = dotGridGradient(x1, y0, x, y);
    ix0 = lerp(n0, n1, sx);

    n0 = dotGridGradient(x0, y1, x, y);
    n1 = dotGridGradient(x1, y1, x, y);
    ix1 = lerp(n0, n1, sx);

    value = lerp(ix0, ix1, sy);
    return value;
}