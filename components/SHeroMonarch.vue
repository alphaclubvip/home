<script setup lang="ts">
const config = useRuntimeConfig();

</script>

<template>
    <div class="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
        <div class="text-center">
            <h2 class="text-base font-semibold text-indigo-600 tracking-wide">
                <SlicedStr :value="config.MONARCH_MIXER" :max-length="17" :suffix-length="4" />
            </h2>
            <h1
                class="mt-2 tracking-tight font-extrabold text-gray-900 lg:flex lg:justify-center lg:gap-4 text-4xl sm:text-5xl md:text-6xl">
                <span class="block">Monarch</span>
                <span class="block text-indigo-600">Mixer</span>
            </h1>
            <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Just for owner and host...
            </p>
        </div>
    </div>
</template>
