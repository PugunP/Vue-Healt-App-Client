<template>
  <div class="">
    <l-map style="height: 50vh" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="markerLatLng"><l-tooltip>KMITL</l-tooltip></l-marker>
      <l-marker :lat-lng="markerCar1"><l-tooltip>รถคันที่1!</l-tooltip></l-marker>
      <l-marker :lat-lng="markerCar2"><l-tooltip>รถคันที่2</l-tooltip></l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker,LTooltip } from "@vue-leaflet/vue-leaflet";
export default {
  components: { LMap, LMarker, LTileLayer,LTooltip },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 18,
      center: [10.722959278417832, 99.37594426377524],
      markerLatLng: [10.722959278417832, 99.37594426377524],
      markerCar1: [10.723089, 99.376432],
      markerCar2: [10.723213, 99.375266],
    };
  },
};
</script>

<style lang="scss" scoped></style>
