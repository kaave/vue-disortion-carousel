precision mediump float;

uniform sampler2D start;
uniform sampler2D stop;
uniform float startAngle;
uniform float stopAngle;
uniform float moveThreshold;
uniform sampler2D disp;
uniform float dispFactor;

varying vec2 vUv;

float moveDirection = -1.0;

mat2 getRotM(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s * moveThreshold * moveDirection, c);
}

void main() {
  vec4 disp = texture2D(disp, vUv);
  vec2 dispVec = vec2(disp.r, disp.g);
  vec2 distortedPosition1 = vUv + getRotM(startAngle) * dispVec * dispFactor;
  vec2 distortedPosition2 = vUv + getRotM(stopAngle) * dispVec * (1.0 - dispFactor);

  vec4 _currentImage = texture2D(start, distortedPosition1);
  vec4 _nextImage = texture2D(stop, distortedPosition2);

  gl_FragColor = mix(_currentImage, _nextImage, dispFactor);
}
