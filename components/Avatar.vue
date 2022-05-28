<script setup lang="ts">
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/big-smile";

const props = defineProps({
  seed: {
    type: String,
    default: "",
  },
});

const dataUri = computed(() => {
  return createAvatar(style, {
    seed: props.seed,
    dataUri: true,
    flip: true,
  });
});

const alt = computed(() => {
  return `avatar_${props.seed}`;
});
</script>

<template>
  <img :src="dataUri" :alt="alt" />
</template>
