#ifdef GL_ES
precision highp float;
#endif

//uniform vec2 resolution;

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
        vec2 resolution = vec2(500.0, 500.0);
	vec2 p = (2.0*gl_FragCoord.xy-resolution)/resolution.y;
	vec3 c;
	vec2 BSize = vec2(0.05,0.05);
	vec2 BP = vec2(0.90,0.90);
	vec3 BColor1 = vec3(0.85,0.7,0.7);
	vec3 BColor2 = vec3(0.2,0.2,0.2);

    vec2 Lpos = p.xy / BSize;
	vec2 hsize = vec2(32.0, 32.0);
    c = heart(floor(Lpos) + hsize / 2.0, hsize);
	BColor1 = mix(c, BColor1, 1.0-c.x);
	
	//if (fract (Lpos.y * 0.5)>0.5)
    //	Lpos.x +=0.5;
    Lpos = fract (Lpos);
    vec2 uses = step (Lpos, BP);
    vec3 color = mix (BColor2, BColor1, uses.x * uses.y);// * outLight;
    gl_FragColor = vec4 (color, 1.0);
}
    