<template>
  <figure class="DistortionCarousel">
    <canvas ref="canvas" class="DistortionCarousel__canvas"/>
  </figure>
</template>

<style lang="scss" scoped>
.DistortionCarousel {
  width: 100%;
  margin: 0;
  padding: 0;
}

.DistortionCarousel__canvas {
  width: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue';

import VertexShaderSrc from './shaders/shader.vert';
import FragmentShaderSrc from './shaders/shader.frag';
import { getWebGLContexts } from './utils/getWebGLContext';
import { getUniformLocation } from './utils/getUniformLocation';
import { compileShader } from './utils/compileShader';
import { getConvertToWebGLTextureFromImage } from './utils/convertToWebGLTextureFromImage';
import { getAndCreateBuffer } from './utils/getAndCreateBuffer';
import { getAnimation, IO as AnimationIO } from './utils/getAnimation';
import { loadImages } from './utils/loadImages';
import { resize, Ratio } from './utils/resize';

export type Data = {
  graphicTextures: WebGLTexture[];
  distortionTexture?: WebGLTexture;
  animation?: AnimationIO;
};
export type Methods = { setCanvas: (canvas: HTMLCanvasElement) => Promise<void> };
export type Computed = {};
export type Props = {
  index: number;
  imageUrls: string[];
  distortionTextureUrl: string;
  maxWidth: number;
  ratio: Ratio;
};

const data: () => Data = () => ({ graphicTextures: [], distortionTexture: undefined, animation: undefined });
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
};

export default Vue.extend<Data, Methods, Computed, Props>({
  data,
  props,
  methods: {
    setCanvas: async function(canvas: HTMLCanvasElement) {
      const { gl, program, vertexShader, fragmentShader } = getWebGLContexts(canvas);
      const { maxWidth, ratio } = this;
      const resizeCanvas = () => resize(canvas, ratio, maxWidth);

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
        disp: getUniformLocation('disp', gl, program),
        dispFactor: getUniformLocation('dispFactor', gl, program),
      };

      const images = await Promise.all(loadImages([this.distortionTextureUrl, ...this.imageUrls]));
      const [distortionTexture, ...graphicTextures] = images.map(getConvertToWebGLTextureFromImage(gl));
      this.distortionTexture = distortionTexture;
      this.graphicTextures = graphicTextures;
      const textures = { start: graphicTextures[0], stop: graphicTextures[1], disp: this.distortionTexture };

      resizeCanvas();

      this.animation = getAnimation({
        gl,
        program,
        vertexBuffer,
        vertexLocation,
        uniformLocations,
        textures,
      });
      this.animation.init();

      window.addEventListener('resize', () => resizeCanvas());
    },
  },
  mounted: async function() {
    const canvas = this.$refs.canvas;
    if (canvas instanceof HTMLCanvasElement) {
      this.setCanvas(canvas);
    }
  },
  watch: {
    index(index: number, startIndex: number) {
      const { distortionTexture, animation } = this;
      if (!distortionTexture || !animation) {
        return;
      }

      const max = this.graphicTextures.length;
      const start = this.graphicTextures[startIndex];
      const stop = this.graphicTextures[index];
      animation.setTextures({ start, stop, disp: distortionTexture });
      animation.setValues({ dispFactor: 0 });
      animation.start();
    },
  },
});
</script>
