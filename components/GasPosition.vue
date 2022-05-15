<script setup>
const props = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
});
</script>

<template>
  <div class="relative mt-14">
    <div class="relative m-auto w-4/5 h-5 rounded-xl">
      <div
        class="
          relative
          z-30
          bottom-0
          left-0
          h-5
          bg-gray-600
          rounded-l-full rounded-r-full
        "
      >
        <button
          type="button"
          class="
            absolute
            z-40
            -top-0.5
            w-8
            h-6
            bg-white
            border-blue-400
            rounded-full
            font-mono
            text-gray-600 text-sm
            point
          "
          style="left: 20%"
        >
          20
        </button>
      </div>
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
