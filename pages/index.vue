<template>
  <div>
<!--    <HeroHeader />-->
    <Features/>
    <SBrand />
    <!--    <Team/>-->
  </div>
</template>

<script>
import Features from "../components/Features";
import Team from "../components/Team";
import LAutoWidth from "../components/LAutoWidth";
import HeroHeader from "../components/HeroHeader";
import SBrand from "../components/SBrand";

export default {
  name: "index",
  components: {SBrand, HeroHeader, LAutoWidth, Features, Team}
}
</script>

<style scoped>

</style>
