export function compileShader(gl: WebGLRenderingContext, program: WebGLProgram, shader: WebGLShader, src: string) {
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  gl.attachShader(program, shader);
  gl.deleteShader(shader);
}
