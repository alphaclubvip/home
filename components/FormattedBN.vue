<script setup lang="ts">
import { ethers } from "ethers";

const props = defineProps({
  prefix: {
    type: String,
    default: '',
  },
  bnValue: {
    type: ethers.BigNumber,
    default: ethers.BigNumber.from(0),
  },
  decimals: {
    type: Number,
    default: 0,
  },
  padding: {
    type: Number,
    default: 0,
  },
  keep: {
    type: Boolean,
    default: false,
  },
});

const objValue = computed(() => {
  const s = props.bnValue.toString().trim().replace(new RegExp("^0+"), "");

  let o = { i: "0", f: "" };

  if (props.decimals < s.length) {
    const pos = s.length - props.decimals;
    o.i = s.slice(0, pos);
    o.f = s.slice(pos);
  } else {
    o.f = s;

    while (props.decimals > o.f.length) {
      o.f = "0" + o.f;
    }
  }

  if (o.f && !props.keep) {
    o.f = o.f.replace(new RegExp("0+$"), "");
  }

  if (props.padding) {
    while (props.padding > o.f.length) {
      o.f = o.f + "0";
    }

    if (props.padding < o.f.length) {
      o.f = o.f.slice(0, props.padding);
    }
  }

  return o;
});

const disValue = computed(() => {
  let o = { i: [], f: [] };

  let i = objValue.value.i;

  while (3 < i.length) {
    o.i.unshift(i.slice(-3));
    i = i.slice(0, i.length - 3);
  }

  if (i.length) {
    o.i.unshift(i);
  }

  let f = objValue.value.f;
  if (f) {
    while (3 < f.length) {
      o.f.push(f.slice(0, 3));
      f = f.slice(3);
    }

    if (f.length) {
      o.f.push(f);
    }
  }

  return {
    i: 0 === o.i.length ? (o.i = ["0"]) : o.i.join(","),
    f: o.f,
  };
});
</script>

<template>
  <span>
    <span v-if="prefix" class="fomatted-bn-prefix">{{ prefix }}</span>
    <span>{{ disValue.i }}</span>
    <span v-if="disValue.f.length">.</span>
    <span class="formated-bn" v-for="(part, index) in disValue.f" :key="index">
      {{ part }}
    </span>
  </span>
</template>

<style scoped lang='scss'>
.fomatted-bn-prefix {
  margin-right: 0.2rem;
}

.formated-bn {
  margin-right: 0.2rem;
  font-size: 90%;

  &:last-child {
    margin-right: 0;
  }
}
</style>
