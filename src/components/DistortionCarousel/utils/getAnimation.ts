import { TweenLite, Expo } from 'gsap';

import { Uniforms } from './getUniformLocation';

export interface Props {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  vertexBuffer: WebGLBuffer;
  vertexLocation: number;
  uniformLocations: Uniforms;
  textures: Textures;
}

export interface Textures {
  start: WebGLTexture;
  stop: WebGLTexture;
  disp: WebGLTexture;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IO {
  setTextures: (textures: Textures) => void;
  setValues: (values: { dispFactor: number }) => void;
  init: () => void;
  start: () => void;
  stop: () => void;
}

class Animation implements IO {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  vertexBuffer: WebGLBuffer;
  vertexLocation: number;
  uniformLocations: Uniforms;
  textures: Textures;
  values: { dispFactor: number } = { dispFactor: 0 };
  animationID: number | null = null;

  constructor({ gl, program, vertexBuffer, vertexLocation, uniformLocations, textures }: Props) {
    this.gl = gl;
    this.program = program;
    this.vertexBuffer = vertexBuffer;
    this.vertexLocation = vertexLocation;
    this.uniformLocations = uniformLocations;
    this.textures = textures;
  }

  // eslint-disable-next-line no-return-assign
  setTextures = (textures: Textures) => (this.textures = { ...textures });
  // eslint-disable-next-line no-return-assign
  setValues = (values: { dispFactor: number }) => (this.values = { ...values });

  animation = () => {
    const { gl, program, vertexBuffer, vertexLocation, uniformLocations, textures, values } = this;

    // WebGLを初期化する
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 使用するprogramを指定する
    gl.useProgram(program);

    // 描画に使用する頂点バッファーをattributeとして設定する。
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(vertexLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexLocation);

    [
      { location: uniformLocations.start, texture: textures.start },
      { location: uniformLocations.stop, texture: textures.stop },
      { location: uniformLocations.disp, texture: textures.disp },
    ].forEach(({ location, texture }, i) => {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(location, i);
    });

    const commonAngle = 45 * (Math.PI / 180); // 45 degrees by default, so grayscale images work correctly
    const startAngle = commonAngle;
    const stopAngle = -commonAngle * 3;
    gl.uniform1f(uniformLocations.startAngle, startAngle);
    gl.uniform1f(uniformLocations.stopAngle, stopAngle);
    gl.uniform1f(uniformLocations.dispFactor, values.dispFactor);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    this.animationID = requestAnimationFrame(this.animation);
  };

  init = () => {
    this.run();
    TweenLite.killTweensOf(this.values);
    this.values = { dispFactor: 1 };
    this.stop();
  };

  start = () => {
    this.run();
    TweenLite.killTweensOf(this.values);
    TweenLite.to(this.values, 3, {
      dispFactor: 1,
      ease: Expo.easeInOut,
      onComplete: this.stop,
    });
  };

  stop = () => {
    if (this.animationID) {
      cancelAnimationFrame(this.animationID);
      this.animationID = null;
    }
  };

  run = () => this.animation();
}

export function getAnimation(props: Props): IO {
  return new Animation(props);
}
