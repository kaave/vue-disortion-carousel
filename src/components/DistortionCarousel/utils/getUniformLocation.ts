export type UniformKey = 'start' | 'stop' | 'startAngle' | 'stopAngle' | 'moveThreshold' | 'disp' | 'dispFactor';
export type Uniforms = { [key in UniformKey]: WebGLUniformLocation };

export function getUniformLocation(
  key: UniformKey,
  gl: WebGLRenderingContext,
  program: WebGLProgram,
): WebGLUniformLocation {
  const uniformLocaion = gl.getUniformLocation(program, key);

  if (!uniformLocaion) {
    throw new Error(`Cannot getUniformLocation. [${key}]`);
  }

  return uniformLocaion;
}
