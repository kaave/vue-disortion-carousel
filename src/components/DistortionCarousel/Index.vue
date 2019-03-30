<template>
  <canvas ref="canvas" class="DistortionCarousel"/>
</template>

<style lang="scss" scoped>
.DistortionCarousel {
  width: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { Expo } from 'gsap';

import VertexShaderSrc from './shaders/shader.vert';
import FragmentShaderSrc from './shaders/shader.frag';
import {
  Radian,
  Degree,
  toRadian,
  getWebGLContexts,
  getUniformLocation,
  compileShader,
  getConvertToWebGLTextureFromImage,
  getAndCreateBuffer,
  loadImages,
  resize,
  Ratio,
} from './utils';
import { getAnimation, IO as AnimationIO, Params, Threshold, toThreshold } from './utils/getAnimation';

export type Data = {
  canvas: HTMLCanvasElement | null;
  graphicTextures: WebGLTexture[];
  distortionTexture?: WebGLTexture;
  animation?: AnimationIO;
};
export type Methods = { initialize: () => Promise<void>; resize: () => void };
export type Computed = {};
export type Props = {
  index: number;
  imageUrls: string[];
  distortionTextureUrl: string;
  maxWidth: number;
  ratio: Ratio;
  moveThreshold: number;
};

const data: () => Data = () => ({
  canvas: null,
  graphicTextures: [],
  distortionTexture: undefined,
  animation: undefined,
});
const props = {
  index: Number,
  imageUrls: Array,
  distortionTextureUrl: String,
  maxWidth: {
    type: Number,
    default: 1280,
  },
  ratio: {
    type: Object,
    default: () => ({
      width: 16,
      height: 10,
    }),
  },
  moveThreshold: {
    type: Number,
    default: 0.2,
  },
};

export default Vue.extend<Data, Methods, Computed, Props>({
  data,
  props,
  methods: {
    resize() {
      const { canvas, ratio, maxWidth } = this;

      if (canvas) {
        resize(canvas, ratio, maxWidth);
      }
    },
    initialize: async function() {
      const { canvas, maxWidth, ratio } = this;
      if (!canvas) {
        return;
      }
      const { gl, program, vertexShader, fragmentShader } = getWebGLContexts(canvas);

      compileShader(gl, program, vertexShader, VertexShaderSrc);
      compileShader(gl, program, fragmentShader, FragmentShaderSrc);
      gl.linkProgram(program);

      const vertexBuffer = getAndCreateBuffer(gl);
      const vertexLocation = gl.getAttribLocation(program, 'position');
      const uniformLocations = {
        start: getUniformLocation('start', gl, program),
        stop: getUniformLocation('stop', gl, program),
        startAngle: getUniformLocation('startAngle', gl, program),
        stopAngle: getUniformLocation('stopAngle', gl, program),
        moveThreshold: getUniformLocation('moveThreshold', gl, program),
        disp: getUniformLocation('disp', gl, program),
        dispFactor: getUniformLocation('dispFactor', gl, program),
      };

      const images = await Promise.all(loadImages([this.distortionTextureUrl, ...this.imageUrls]));
      const [distortionTexture, ...graphicTextures] = images.map(getConvertToWebGLTextureFromImage(gl));
      this.distortionTexture = distortionTexture;
      this.graphicTextures = graphicTextures;
      const params: Params = {
        startTexture: graphicTextures[0],
        stopTexture: graphicTextures[1],
        dispTexture: this.distortionTexture,
        startAngle: toRadian(45 as Degree),
        stopAngle: toRadian((45 + 180) as Degree),
        moveThreshold: toThreshold(1 - this.moveThreshold),
        durationSec: 2.5,
        easing: Expo.easeInOut,
      };

      this.resize();

      this.animation = getAnimation({
        gl,
        program,
        vertexBuffer,
        vertexLocation,
        uniformLocations,
        params,
      });
      this.animation.init();

      window.addEventListener('resize', () => this.resize());
    },
  },
  mounted: async function() {
    const canvas = this.$refs.canvas;
    if (canvas instanceof HTMLCanvasElement) {
      this.canvas = canvas;
      this.initialize();
    }
  },
  watch: {
    index(index: number, startIndex: number) {
      const { distortionTexture, animation } = this;
      if (!distortionTexture || !animation) {
        return;
      }

      const max = this.graphicTextures.length;
      const startTexture = this.graphicTextures[startIndex];
      const stopTexture = this.graphicTextures[index];
      animation.setParams({ startTexture, stopTexture });
      animation.setValues({ dispFactor: 0 });
      animation.start();
    },
    moveThreshold(threshold: number, _: number) {
      const { animation } = this;
      if (animation) {
        animation.setParams({ moveThreshold: toThreshold(1 - threshold) });
      }
    },
    ratio() {
      this.resize();
    },
  },
});
</script>
