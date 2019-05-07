export function getAndCreateBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, 1]);
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    throw new Error('Cannot create vertexBuffer');
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return vertexBuffer;
}
