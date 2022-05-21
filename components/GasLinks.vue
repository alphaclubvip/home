<script setup>
const links = [
  {
    name: "Ethereum Gas Tracker",
    initials: "GT",
    href: "https://etherscan.io/gastracker/",
    desc: "etherscan.io",
    bgColor: "bg-pink-600",
  },
  {
    name: "Gas Price",
    initials: "GP",
    href: "https://www.gasprice.io/",
    desc: "gasprice.io",
    bgColor: "bg-purple-600",
  },
  {
    name: "ETH Gas Station",
    initials: "GS",
    href: "https://ethgasstation.info/",
    desc: "ethgasstation.info",
    bgColor: "bg-yellow-500",
  },
  {
    name: "Ethereum Gas Charts",
    initials: "GC",
    href: "https://ethereumprice.org/gas/",
    desc: "ethereumprice.org",
    bgColor: "bg-green-500",
  },
];
</script>

<template>
  <div>
    <h2 class="text-gray-500 text-xs font-medium uppercase tracking-wide">
      Other Gas Monitors
    </h2>
    <ul
      role="list"
      class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      <li
        v-for="link in links"
        :key="link.name"
        class="col-span-1 flex shadow-sm rounded-md"
      >
        <div
          :class="[
            link.bgColor,
            'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md',
          ]"
        >
          {{ link.initials }}
        </div>
        <div
          class="
            flex-1 flex
            items-center
            justify-between
            border-t border-r border-b border-gray-200
            bg-white
            rounded-r-md
            truncate
          "
        >
          <div class="flex-1 px-4 py-2 text-sm truncate">
            <a
              :href="link.href"
              target="_blank"
              class="text-gray-900 font-medium hover:text-gray-600"
              >{{ link.name }}</a
            >
            <p class="text-gray-500">{{ link.desc }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
