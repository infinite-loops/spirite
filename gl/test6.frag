#extension GL_OES_standard_derivatives : enable
#define CORRECT_STREAMLINES
#define saturate(x) clamp(x, 0., 1.)

const float PI = 3.1419;
float rand(float n){return fract(sin(n) * 43758.5453123);}
vec2 force(vec2 p, vec2 pole) {
    // return normalize(p - pole) / distance(p, pole);
    // optim by Fabrice:
    p -= pole;
    return p / dot(p,p);
}

float calcVelocity(vec2 p) {
    vec2 velocity = vec2(0);
    vec2 pole;
    vec2 f;
    float o, r, m;
    float flip = 1.;
    float j = 0.;
    const float limit = 15.;
    for (float i = 0.; i < limit; i++) {
        r = rand(i / limit) - .5;
        m = rand(i + 1.) - .5;
        m *= (iTime+(23.78 * 1000.)) * 2.;
        o = i + r + m;
        pole = vec2(
        sin(o / limit * PI * 2.),
        cos(o / limit * PI * 2.)
        );
        f = force(p, pole);
        flip *= -1.;
        velocity -= f * flip;
        j += atan(f.x, f.y) * flip;
    }
    velocity = normalize(velocity);
    #ifdef CORRECT_STREAMLINES
    return j;
    #endif
    return atan(velocity.x, velocity.y);
}

vec2 dir(float a) {
    return vec2(sin(a), cos(a));
}

float calcDerivitive(float a, vec2 p) {
    vec2 v = dir(a);
    float n = 2. / iResolution.x;
    float d = 0.;
    d += length(v - dir(calcVelocity(p + vec2(0,n))));
    d += length(v - dir(calcVelocity(p + vec2(n,0))));
    d += length(v - dir(calcVelocity(p + vec2(n,n))));
    d += length(v - dir(calcVelocity(p + vec2(n,-n))));
    d /= 4.;
    return d;
}

float spacing = 1./30.;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (-iResolution.xy + 2.0*fragCoord.xy)/iResolution.x;
    p *= 3.;
    float a = calcVelocity(p);
    float deriv = calcDerivitive(a, p);
    a /= PI * 2.;
    //fragColor = vec4(vec2(sin(atan(v.x, v.y)), cos(atan(v.x, v.y))) * .5 + .5, 0, 0); return;
    //fragColor = vec4(1.-abs(a)*2.); return;
    //a = result.z;
    float lines = fract(a / spacing);
    // create stripes
    lines = min(lines, 1. - lines) * 2.;
    // thin stripes into lines
    lines /= deriv / spacing;
    // maintain constant line width across different screen sizes
    lines -= iResolution.x * .0005;
    // don't blow out contrast when blending below
    lines = saturate(lines);
    float disc = length(p) - 1.0;
    //    disc /= fwidth(disc);
    //    disc = saturate(disc);
    //    lines = mix(1.0 - lines, lines, disc);
    lines = pow(lines, 1.0 / 2.2);
    fragColor = vec4(1.0 - lines);
}
