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
    name: "Bulk",
    to: "/bulk",
  },
  {
    name: "Test",
    to: "/test",
  },
];

const userMenuItems = [
  {
    name: "Your Profile",
    to: "/profile",
  },
  {
    name: "Setting",
    to: "/setting",
  },
];

const account = useWeb3Account();
const accountENS = useWeb3AccountENS();
const address = useWeb3Address();
</script>


<template>
  <Disclosure as="nav" class="bg-white shadow" v-slot="{ open }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="-ml-2 mr-2 flex items-center md:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton class="
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
              ">
              <span class="sr-only">Open main menu</span>
              <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          <JtLink to="/" class="flex-shrink-0 flex items-center">
            <img class="block lg:hidden h-10 w-auto" src="/logo-ac.svg" alt="AlphaClub.VIP" />
            <img class="hidden lg:block h-10 w-auto" src="/logo-ac-full.svg" alt="AlphaClub.VIP" />
          </JtLink>
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <template v-for="nav in navigations" :key="nav.name">
              <JtLink :to="nav.to" class="desktop-nav">{{ nav.name }}</JtLink>
            </template>
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span v-if="account" class="font-mono">
              <SlicedStr :value="address" :max-length="13" :suffix-length="4" />
            </span>
            <ConnectWallet v-else class="relative jt-btn-sm indigo" />
          </div>
          <div v-if="account" class="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton class="
                    bg-white
                    rounded-full
                    flex
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-indigo-500
                  ">
                  <span class="sr-only">Open user menu</span>
                  <Avatar :seed="account" class="h-10 w-10 border border-gray-300 rounded-full" />
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="
                    origin-top-right
                    absolute
                    right-0
                    mt-2
                    w-48
                    rounded-md
                    shadow-lg
                    py-1
                    bg-white
                    ring-1 ring-black ring-opacity-5
                    focus:outline-none
                  ">
                  <MenuItem v-slot="{ active }" v-for="(item, index) in userMenuItems" :key="index">
                  <JtLink :to="item.to"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700',]">
                    {{ item.name }}
                  </JtLink>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
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
      <div v-if="account" class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4 sm:px-6">
          <div class="flex-shrink-0">
            <Avatar :seed="account" class="h-12 w-12 border border-gray-300 rounded-full" />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ accountENS ? accountENS : "Unnamed" }}</div>
            <div class="text-sm font-medium text-gray-500 truncate">
              <SlicedStr :value="account" :max-length="25" :suffix-length="4" />
            </div>
          </div>
          <button type="button" class="
              ml-auto
              flex-shrink-0
              bg-white
              p-1
              rounded-full
              text-gray-400
              hover:text-gray-500
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
            ">
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-3 space-y-1">
          <NuxtLink v-for="(item, index) in userMenuItems" :key="index" :to="item.to">
            <DisclosureButton class="
                block
                w-full
                px-4
                py-2
                text-base
                font-medium
                text-gray-500
                hover:text-gray-800 hover:bg-gray-100
                sm:px-6
                text-left
              ">
              {{ item.name }}
            </DisclosureButton>
          </NuxtLink>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
