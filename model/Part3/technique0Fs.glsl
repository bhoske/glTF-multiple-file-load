precision highp float;
varying vec3 v_normal;
uniform vec3 u_diffuse;
uniform samplerCube envMap;
varying vec3 vReflect;
uniform float u_reflectivity;
varying vec4 v_vert;
void main(void) {
vec3 normal = normalize(v_normal);
float lambert = 0.;
if( gl_FrontFacing )
	lambert = dot(normal,vec3(0.,0.,1.));
else
	lambert = dot(normal,vec3(0.,0.,-1.));
if(lambert <0.0)
	lambert = -1.0*lambert;

vec3 u_light= vec3(0.0,0.0,1.0);
float u_shininess = 3.0;
vec3 e = normalize(v_vert.xyz);
vec3 r = reflect(u_light, normal);
float specular = pow( max(dot(r, e), 0.0), u_shininess );
vec3 u_specularColor = vec3(1.0,1.0,1.0);
	
vec4 color = vec4(0., 0., 0., 0.);
float intensity=1.0;
color = color + vec4(specular+u_diffuse,1.) * vec4(lambert*intensity,lambert*intensity,lambert*intensity,1.);
gl_FragColor = vec4(color.rgb * color.a, color.a);


vec4 cubeColor = textureCube( envMap, vec3(  vReflect.x, vReflect.yz ) );
gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, u_reflectivity );

}