<script setup lang="ts">
import { ethers } from "ethers";
const moving = ref(false);
const percent = ref(200);

const bar = ref<HTMLElement>();
const slide = ref<HTMLElement>();

const barWidth = ref(0);
const barHeight = ref(0);
const barLeft = ref(0);
const barTop = ref(0);
const barRight = computed(() => {
  return barLeft.value + barWidth.value;
});
const barBottom = computed(() => {
  return barTop.value + slideHeight.value;
});

const slideWidth = ref(0);
const slideHeight = ref(0);
const slideLeft = ref(0);
const slideTop = ref(0);

const slideStyleLeft = computed(() => {
  return (
    "left: " +
    (percent.value - (slideWidth.value / 2 / barWidth.value) * 1000) / 10 +
    "%"
  );
});

function init() {
  // bar
  barWidth.value = bar.value.clientWidth;
  barHeight.value = bar.value.clientHeight;
  barLeft.value = bar.value.offsetLeft;
  barTop.value = bar.value.offsetTop;

  // slide
  slideWidth.value = slide.value.clientWidth;
  slideHeight.value = slide.value.clientHeight;
  slideLeft.value = slide.value.offsetLeft;
  slideTop.value = slide.value.offsetTop;
}

const emit = defineEmits<{
  (e: "percentUpdated", value: number): void;
}>();

onMounted(async () => {
  bar.value = document.querySelector(".gas-position .bar");
  slide.value = document.querySelector(".gas-position .slide");
  init();
  emit("percentUpdated", percent.value);
});

function onMouseDown(e: MouseEvent) {
  moving.value = true;
  init();
  onMouseMove(e);
}

function onMouseMove(e: MouseEvent) {
  if (moving.value) {
    if (e.clientX < barLeft.value) {
      moving.value = false;
      return;
    }

    if (e.clientX > barRight.value) {
      moving.value = false;
      return;
    }

    if (e.clientY < barTop.value) {
      moving.value = false;
      return;
    }

    if (e.clientY > barBottom.value) {
      moving.value = false;
      return;
    }

    const x = Math.max(e.clientX, barLeft.value);
    percent.value = Math.ceil(((x - barLeft.value) / barWidth.value) * 1000);
    emit("percentUpdated", percent.value);
  }
}

function onMouseUp(e: MouseEvent) {
  moving.value = false;
}
</script>

<template>
  <div
    class="gas-position"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <div class="bar" @mousedown="onMouseDown">
      <button
        type="button"
        class="slide"
        :style="slideStyleLeft"
        @mousedown="onMouseDown"
      >
        <FomattedBN :bn-value="ethers.BigNumber.from(percent)" :decimals="1" />
        <span class="ml-0.5">%</span>
      </button>
    </div>
    <div class="mt-2 mx-auto w-11/12 md:w-5/6 flex justify-between select-none">
      <span class="text-green-500"> Cheaper </span>
      <span class="text-pink-500"> Faster </span>
    </div>
  </div>
</template>

<style lang="scss">
.gas-position {
  @apply py-12;

  .bar {
    @apply z-30 relative bottom-0 left-0 mx-auto w-11/12 md:w-5/6 h-5 bg-gradient-to-r from-green-500 via-purple-400 to-pink-500 rounded-l-full rounded-r-full;
  }

  .slide {
    @apply z-40 absolute -top-1.5 block w-16 h-8 bg-white border-2 border-indigo-400 shadow-md shadow-indigo-500/50 rounded-l-full rounded-r-full font-mono text-gray-600 text-sm select-none;
  }
}
</style>
