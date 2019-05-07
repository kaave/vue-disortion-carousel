export const getConvertToWebGLTextureFromImage = (gl: WebGLRenderingContext) => (img: HTMLImageElement) => {
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error('Cannot create WebGL texture.');
  }
  // imageをテクスチャーとして更新する
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // どんなサイズの画像でもレンダリングできるようにパラメータを設定する
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  // gl.generateMipmap(gl.TEXTURE_2D);

  return texture;
};
