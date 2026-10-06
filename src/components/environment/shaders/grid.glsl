// Anti-aliased procedural grid intensity.
float spatialGrid(vec2 uv,float scale){vec2 cell=abs(fract(uv*scale-.5)-.5)/fwidth(uv*scale);return 1.0-min(min(cell.x,cell.y),1.0);}