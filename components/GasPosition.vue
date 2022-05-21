<script setup lang="ts">
import { ethers } from "ethers";
const currentInstance = ref();
const moving = ref(false);
const percent = ref(200);

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
  barWidth.value = currentInstance.value.ctx.$refs.bar.clientWidth;
  barHeight.value = currentInstance.value.ctx.$refs.bar.clientHeight;
  barLeft.value = currentInstance.value.ctx.$refs.bar.offsetLeft;
  barTop.value = currentInstance.value.ctx.$refs.bar.offsetTop;

  // slide
  slideWidth.value = currentInstance.value.ctx.$refs.slide.clientWidth;
  slideHeight.value = currentInstance.value.ctx.$refs.slide.clientHeight;
  slideLeft.value = currentInstance.value.ctx.$refs.slide.offsetLeft;
  slideTop.value = currentInstance.value.ctx.$refs.slide.offsetTop;
}

const emit = defineEmits<{
  (e: "percentUpdated", value: number): void;
}>();

onMounted(async () => {
  currentInstance.value = getCurrentInstance();
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

defineExpose({
  percent,
});
</script>

<template>
  <div
    class="py-12"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <div
      ref="bar"
      class="
        z-30
        relative
        bottom-0
        left-0
        mx-auto
        w-11/12
        md:w-5/6
        h-5
        bg-gradient-to-r
        from-green-500
        via-purple-400
        to-pink-500
        rounded-l-full rounded-r-full
      "
      @mousedown="onMouseDown"
    >
      <button
        type="button"
        ref="slide"
        class="
          z-40
          absolute
          -top-1.5
          block
          w-16
          h-8
          bg-white
          border-2 border-indigo-400
          shadow-md shadow-indigo-500/50
          rounded-l-full rounded-r-full
          font-mono
          text-gray-600 text-sm
          select-none
        "
        :style="slideStyleLeft"
        @mousedown="onMouseDown"
      >
        <FomattedBN :bn-value="ethers.BigNumber.from(percent)" :decimals="1" />
        <span class="ml-0.5">%</span>
      </button>
    </div>
    <div class="mt-2 mx-auto w-11/12 md:w-5/6 flex justify-between">
      <span class="text-green-500"> Cheaper </span>
      <span class="text-pink-500"> Faster </span>
    </div>
  </div>
</template>

<style lang="scss">
// * {
//   -webkit-user-select: none;
//   -moz-user-select: none;
//   -ms-user-select: none;
//   user-select: none;
// }
</style>
