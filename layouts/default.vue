<template>
  <div>
    <SiteHeader/>
    <slot/>
    <SiteFooter/>
  </div>
</template>

<style>

</style>
<script>
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export default {
  components: {SiteHeader, SiteFooter}
}
</script>