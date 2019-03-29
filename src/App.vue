<template>
  <div id="app">
    <distortion-carousel
      :index="index"
      :image-urls="imageUrls"
      :distortion-texture-url="distortionTextureUrl"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import DistortionCarousel from './components/DistortionCarousel/Index.vue';

@Component({ components: { DistortionCarousel } })
export default class App extends Vue {
  index = 0;

  get imageUrls(): string[] {
    return ['/d1.jpg', '/d2.jpg', '/d3.jpg'];
  }

  get distortionTextureUrl(): string {
    return '/texture.jpg';
  }

  mounted() {
    setInterval(() => {
      this.index = (this.index + 1) % this.imageUrls.length;
    }, 3000);
  }
}
</script>
