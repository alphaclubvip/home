<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/vue/outline";

const navigations = [
  {
    name: "Gas",
    to: "/gas",
  },
  {
    name: "Test",
    to: "/test",
  },
];

const account = computed(() => {
  const account = useState("account").value;
  if (account) {
    return String(account);
  } else {
    return String();
  }
});

const address = computed(() => {
  if (account) {
    return account.value.slice(0, 6) + "..." + account.value.slice(-4);
  } else {
    return "";
  }
});
</script>


<template>
  <Disclosure as="nav" class="bg-white shadow" v-slot="{ open }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="-ml-2 mr-2 flex items-center md:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
              class="
                inline-flex
                items-center
                justify-center
                p-2
                rounded-md
                text-gray-400
                hover:text-gray-500 hover:bg-gray-100
                focus:outline-none
                focus:ring-2
                focus:ring-inset
                focus:ring-indigo-500
              "
            >
              <span class="sr-only">Open main menu</span>
              <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          <JtLink to="/" class="flex-shrink-0 flex items-center">
            <img
              class="block lg:hidden h-10 w-auto"
              src="/logo-ac.svg"
              alt="AlphaClub.VIP"
            />
            <img
              class="hidden lg:block h-10 w-auto"
              src="/logo-ac-full.svg"
              alt="AlphaClub.VIP"
            />
          </JtLink>
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <template v-for="nav in navigations" :key="nav.name">
              <JtLink :to="nav.to" class="desktop-nav">{{ nav.name }}</JtLink>
            </template>
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span v-if="account" class="font-mono">{{ address }}</span>
            <ConnectWallet v-else class="relative jt-btn-sm indigo" />
          </div>
          <!-- ... -->
        </div>
      </div>
    </div>

    <DisclosurePanel class="md:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <template v-for="nav in navigations" :key="nav.name">
          <JtLink :to="nav.to" class="mobi-nav">
            <DisclosureButton class="wrap">
              {{ nav.name }}
            </DisclosureButton>
          </JtLink>
        </template>
      </div>
      <!-- ... -->
    </DisclosurePanel>
  </Disclosure>
</template>
