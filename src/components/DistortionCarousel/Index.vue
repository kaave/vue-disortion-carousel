<template>
  <figure class="DistortionCarousel">
    <palette/>
    <figcaption class="DistortionCarousel__caption">Distortion Carousel</figcaption>
  </figure>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from 'vue-property-decorator';

import VertexShaderSrc from './shader.vert';
import FragmentShaderSrc from './shader.frag';
import Palette from './Palette.vue';
import { getWebGLContexts } from './utils/getWebGLContext';
import { getUniformLocation } from './utils/getUniformLocation';
import { compileShader } from './utils/compileShader';
import { getConvertToWebGLTextureFromImage } from './utils/convertToWebGLTextureFromImage';
import { getAndCreateBuffer } from './utils/getAndCreateBuffer';
import { getAnimation, IO as AnimationIO } from './utils/getAnimation';
import { loadImages } from './utils/loadImages';
import { resize } from './utils/resize';

@Component({ components: { Palette } })
export default class DistortionCarousel extends Vue {
  graphicTextures: WebGLTexture[] = [];
  distortionTexture?: WebGLTexture;
  animation?: AnimationIO;

  @Prop() private index!: number;
  @Prop() private imageUrls!: string[];
  @Prop() private distortionTextureUrl!: string;

  @Provide() setCanvas = async (canvas: HTMLCanvasElement) => {
    const { gl, program, vertexShader, fragmentShader } = getWebGLContexts(canvas);
    const resizeCanvas = () => resize(canvas, [16, 10], 1280);

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
    this.animation.setValues({ dispFactor: 0 });
    this.animation.start();

    window.addEventListener('resize', () => resizeCanvas());
  };

  // @ts-ignore onIndexUpdateにarrowfunctionを適用する必要がある...のか？
  @Watch('index') onIndexUpdate = (index: number, startIndex: number): void => {
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
  };
}
</script>

<style lang="scss" scoped>
.DistortionCarousel {
  width: 100%;
}
</style>

