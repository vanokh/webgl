
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec4 mouse;

		vec4 mod289(vec4 x) {
		  return x - floor(x * (1.0 / 289.0)) * 289.0;
		}

		vec4 permute(vec4 x) {
		  return mod289(((x*34.0)+1.0)*x);
		}

		vec4 taylorInvSqrt(vec4 r) {
		  return 1.79284291400159 - 0.85373472095314 * r;
		}

		vec2 fade(vec2 t) {
		  return t*t*t*(t*(t*6.0-15.0)+10.0);
		}

		// Classic Perlin noise
		float cnoise(vec2 P) {
		  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
		  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
		  Pi = mod289(Pi); // To avoid truncation effects in permutation
		  vec4 ix = Pi.xzxz;
		  vec4 iy = Pi.yyww;
		  vec4 fx = Pf.xzxz;
		  vec4 fy = Pf.yyww;

		  vec4 i = permute(permute(ix) + iy);

		  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
		  vec4 gy = abs(gx) - 0.5 ;
		  vec4 tx = floor(gx + 0.5);
		  gx = gx - tx;

		  vec2 g00 = vec2(gx.x,gy.x);
		  vec2 g10 = vec2(gx.y,gy.y);
		  vec2 g01 = vec2(gx.z,gy.z);
		  vec2 g11 = vec2(gx.w,gy.w);

		  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
		  g00 *= norm.x;  
		  g01 *= norm.y;  
		  g10 *= norm.z;  
		  g11 *= norm.w;  

		  float n00 = dot(g00, vec2(fx.x, fy.x));
		  float n10 = dot(g10, vec2(fx.y, fy.y));
		  float n01 = dot(g01, vec2(fx.z, fy.z));
		  float n11 = dot(g11, vec2(fx.w, fy.w));

		  vec2 fade_xy = fade(Pf.xy);
		  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
		  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
		  return 2.3 * n_xy;
		}

vec3 heart(vec2 pos, vec2 res)
{
    vec2 p = (2.0*pos.xy-res)/res.y;
    p.y -= 0.5;

    p *= vec2(0.75,0.9);

    
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p);

    // shape
    float h = abs(a);
    float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);

    // color
    float f = step(r,d) * pow(1.0-r/d,0.25);

    return vec3(f,0.0,0.0);
}

void main(void)
{
    vec2 p = (2.0*gl_FragCoord.xy-resolution)/resolution.y;
	vec3 c;
	vec2 BSize = vec2(0.05,0.05);
	vec2 BP = vec2(0.90,0.90);
	vec3 BColor1 = vec3(0.95,0.8,0.8);
	vec3 BColor2 = vec3(0.2,0.2,0.2);

    vec2 Lpos = p.xy / BSize;
	vec2 hsize = vec2(32.0, 32.0);
    c = heart(floor(Lpos) + hsize / 2.0, hsize);
	BColor1 = mix(c, BColor1, 1.0-c.x);

	float n = cnoise(floor(Lpos)/10.0);// / 8.0 + 0.875;
	vec3 cn = vec3(n,1.0,n)/10.0+vec3(0.85,0.89,0.85);
	
	//if (fract (Lpos.y * 0.5)>0.5)
    //	Lpos.x +=0.5;
    Lpos = fract (Lpos);
    vec2 uses = step (Lpos, BP);
    vec3 color = cn*cn*mix (BColor2, BColor1, uses.x * uses.y);// * outLight;
    gl_FragColor = vec4 (color, 1.0);
}
    