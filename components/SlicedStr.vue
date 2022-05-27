<script setup lang="ts">
const props = defineProps({
  value: { type: String, default: "" },
  connector: { type: String, default: "..." },
  maxLength: { type: Number, default: 0 },
  suffixLength: { type: Number, default: 0 },
});

const str = computed(() => {
  if (0 >= props.maxLength) return props.value;
  if (props.value.length <= props.maxLength) return props.value;
  if (props.maxLength <= props.connector.length) return props.connector;

  if (props.maxLength < props.connector.length + props.suffixLength) {
    return (
      props.connector +
      props.value.slice(props.connector.length - props.maxLength)
    );
  }

  if (0 === props.suffixLength) {
    return (
      props.value.slice(0, props.maxLength - props.connector.length) +
      props.connector
    );
  }

  const prefixLength =
    props.maxLength - props.connector.length - props.suffixLength;

  if (0 < prefixLength) {
    return (
      props.value.slice(0, prefixLength) +
      props.connector +
      props.value.slice(-props.suffixLength)
    );
  }

  return props.connector + props.value.slice(-props.suffixLength);
});
</script>

<template>
  {{ str }}
</template>
