<template>
  <canvas ref="palette" class="DistortionCarousel__canvas Palette"/>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';

@Component
export default class Palette extends Vue {
  @Inject() readonly setCanvas!: (canvas: HTMLCanvasElement) => void;

  mounted() {
    if (this.$refs.palette instanceof HTMLCanvasElement) {
      this.setCanvas(this.$refs.palette);
    }
  }
}
</script>
