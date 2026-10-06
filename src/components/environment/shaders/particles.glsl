// Soft circular GPU point sprite.
float neuralParticle(vec2 pointCoord){float d=length(pointCoord-vec2(.5));return smoothstep(.5,.08,d);}