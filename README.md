# vue-disortion-carousel

Vue Image distortion carousel component. Not dependencies any WebGL libraries like three.js, pixi.js.

## Sample code

```vue
<template>
  <distortion-carousel
    :index="index"
    :image-urls="imageUrls"
    distortion-texture-url="/texture.jpg"
    :max-width="1000"
    :ratio="{ width: 16, height: 10 }"
    :move-threshold="0.2"
    :duration-sec="2.5"
    :easing="easing"
  >
    It's Readable Content!
  </distortion-carousel>
</template>

<script>
import Vue from 'vue';
import { Expo, Ease } from 'gsap';
import DistortionCarousel from '@kaave/vue-distortion-carousel.vue';

export default {
  component: { DistortionCarousel },
  data() {
    return { index: 0 },
  },
  computed: {
    imageUrls() { return ['/d1.jpg', '/d2.jpg', '/d3.jpg'] },
    easing() { return Expo.easeInOut; },
  },
  mounted: {
    setInterval
  },
};
</script>
```

## Inspiration

- [robin-dela/hover-effect](https://github.com/robin-dela/hover-effect)
