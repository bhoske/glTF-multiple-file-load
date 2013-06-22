precision highp float;
attribute vec3 a_normal;
uniform mat3 u_normalMatrix;
varying vec3 v_normal;
attribute vec3 a_position;
uniform mat4 u_worldviewMatrix;
uniform mat4 u_projectionMatrix;
varying vec3 vReflect;
varying vec4 v_vert;
void main(void) {
v_normal = normalize(u_normalMatrix * a_normal);
gl_Position = u_projectionMatrix * u_worldviewMatrix * vec4(a_position,1.0);
mat4 objectMatrix=u_projectionMatrix*u_worldviewMatrix;
vec4 mPosition = objectMatrix * vec4( a_position, 1.0 );
vec3 nWorld = mat3( objectMatrix[ 0 ].xyz, objectMatrix[ 1 ].xyz, objectMatrix[ 2 ].xyz ) * v_normal;
vec3 camera_pos =vec3(0.,0.,0.1);
v_vert = u_worldviewMatrix * vec4(a_position,1.0);
vReflect = reflect( normalize( mPosition.xyz - camera_pos.xyz ), normalize( nWorld.xyz ) );
}
