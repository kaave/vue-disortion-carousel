import { TweenLite, Ease } from 'gsap';

import { Uniforms } from './getUniformLocation';
import { Radian } from './angle';

export interface Props {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  vertexBuffer: WebGLBuffer;
  vertexLocation: number;
  uniformLocations: Uniforms;
  params: Params;
}

export type Params = {
  startTexture: WebGLTexture;
  stopTexture: WebGLTexture;
  dispTexture: WebGLTexture;
  startAngle: Radian;
  stopAngle: Radian;
  moveThreshold: number;
  durationSec: number;
  easing: Ease;
};

export type Threshold = number & { __threshold: never };
export function toThreshold(threshold: number): Threshold {
  if (threshold < 0 || threshold > 1) {
    throw new Error('Invalid Threshold: threshold range is 0 to 1');
  }

  return threshold as Threshold;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IO {
  setParams: (params: Partial<Params>) => void;
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
  params: Params;
  values: { dispFactor: number } = { dispFactor: 0 };
  animationID: number | null = null;

  constructor({ gl, program, vertexBuffer, vertexLocation, uniformLocations, params }: Props) {
    this.gl = gl;
    this.program = program;
    this.vertexBuffer = vertexBuffer;
    this.vertexLocation = vertexLocation;
    this.uniformLocations = uniformLocations;
    this.params = params;
  }

  // eslint-disable-next-line no-return-assign
  setParams = (params: Partial<Params>) => (this.params = { ...this.params, ...params });
  // eslint-disable-next-line no-return-assign
  setValues = (values: { dispFactor: number }) => (this.values = { ...values });

  animation = () => {
    const { gl, program, vertexBuffer, vertexLocation, uniformLocations, values, params } = this;

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
      { location: uniformLocations.start, texture: params.startTexture },
      { location: uniformLocations.stop, texture: params.stopTexture },
      { location: uniformLocations.disp, texture: params.dispTexture },
    ].forEach(({ location, texture }, i) => {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(location, i);
    });

    gl.uniform1f(uniformLocations.startAngle, params.startAngle);
    gl.uniform1f(uniformLocations.stopAngle, params.stopAngle);
    gl.uniform1f(uniformLocations.moveThreshold, params.moveThreshold);
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
    TweenLite.to(this.values, this.params.durationSec, {
      dispFactor: 1,
      ease: this.params.easing,
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
