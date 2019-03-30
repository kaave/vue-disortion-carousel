<template>
  <div class="app">
    <distortion-carousel
      :index="index"
      :image-urls="imageUrls"
      :distortion-texture-url="distortionTextureUrl"
      :max-width="1000"
      :ratio="{ width: 16, height: 10 }"
      :move-threshold="0.2"
      :duration-sec="2.5"
      :easing="easing"
    >It's Readable Content!</distortion-carousel>
  </div>
</template>

<style lang="scss" scoped>
.app {
  width: 70%;
  margin: auto;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { Expo, Ease } from 'gsap';

import DistortionCarousel from './components/DistortionCarousel/Index.vue';

const component = { DistortionCarousel };

type Data = { index: number };
type Methods = {};
type Computed = {
  imageUrls: string[];
  distortionTextureUrl: string;
};
type Props = {};
const components = { DistortionCarousel };
const data: () => Data = () => ({ index: 0 });

export default Vue.extend<Data, Methods, Computed, Props>({
  components,
  data,
  computed: {
    imageUrls(): string[] {
      return ['/d1.jpg', '/d2.jpg', '/d3.jpg'];
    },
    distortionTextureUrl(): string {
      return '/texture.jpg';
    },
    easing(): Ease {
      return Expo.easeOut;
    },
  },
  mounted() {
    setInterval(() => {
      this.index = (this.index + 1) % this.imageUrls.length;
    }, 3000);
  },
});
</script>
