export function getWebGLContexts(
  canvas: HTMLCanvasElement,
): {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
} {
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    throw new Error('Cannot get WebGLContext');
  }

  const program = gl.createProgram();
  if (!program) {
    throw new Error('Cannot create WebGLProgram');
  }

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vertexShader) {
    throw new Error('Cannot create vertexShader');
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragmentShader) {
    throw new Error('Cannot create fragmentShader');
  }

  return { gl, program, vertexShader, fragmentShader };
}
