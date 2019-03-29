export type Draft<T, D extends keyof T> = { [K in keyof T]: (K extends D ? T[K] | null : T[K]) };

export type Uniforms = {
  start: WebGLUniformLocation;
  stop: WebGLUniformLocation;
  startAngle: WebGLUniformLocation;
  stopAngle: WebGLUniformLocation;
  disp: WebGLUniformLocation;
  dispFactor: WebGLUniformLocation;
};

export type UniformKey = keyof Uniforms;

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
