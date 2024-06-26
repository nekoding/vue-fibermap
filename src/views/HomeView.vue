<template>
  <a-spin size="large" tip="Load Fibermap..." :spinning="!fibermapStore.isMapLoaded">
    <div id="overlay-map" v-show="fibermapStore.isMapLoaded">
      <div class="top-left">
        <MapToolset
          :zoom-in-action="zoomInMap"
          :zoom-out-action="zoomOutMap"
          :fit-map-action="fitToBoundMap"
        />
      </div>
      <div class="top-center">
        <MapSearchBar />
      </div>
      <div class="right-bottom">
        <MapLegend />
      </div>
    </div>
    <div ref="mapRef" id="map"></div>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'

import MapToolset from '../components/MapToolset.vue'
import MapLegend from '../components/MapLegend.vue'
import MapSearchBar from '../components/MapSearchBar.vue'
import { useFiberMapStore } from '../stores/fibermap'

const fibermapStore = useFiberMapStore()
const mapRef = ref<HTMLElement>()
const zoomInMap = ref<Function>(() => {})
const zoomOutMap = ref<Function>(() => {})
const fitToBoundMap = ref<Function>(() => {})

onMounted(() => {
  if (mapRef.value) {
    // initialize map
    const markers = L.markerClusterGroup({
      chunkedLoading: true
    })

    const map = L.map(mapRef.value, {
      zoomControl: false
    }).setView(fibermapStore.mapCenter, fibermapStore.mapZoomLevel)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

    fibermapStore.isMapLoaded = true

    // add markers
    markers.addLayers(fibermapStore.markerList.map((marker) => marker.marker))
    map.addLayer(markers)

    // subscribe to store
    fibermapStore.$subscribe(() => {
      // update marker visible when state changed
      markers.clearLayers()
      markers.addLayers(
        fibermapStore.markerList
          .filter((marker) => marker.layer.isVisible)
          .map((marker) => marker.marker)
      )
    })

    // set zoom in/out action
    zoomInMap.value = () => {
      map.zoomIn()
    }

    zoomOutMap.value = () => {
      map.zoomOut()
    }

    fitToBoundMap.value = () => {
      map.fitBounds(
        L.latLngBounds(fibermapStore.markerList.map((marker) => marker.marker.getLatLng()))
      )
    }

    // fix map has blank space on the right side
    watch(
      () => fibermapStore.isSidebarCollapsed,
      () => {
        setTimeout(() => {
          map.invalidateSize()
        }, 400)
      }
    )
  }
})
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
}

.right-bottom,
.top-left,
.top-center {
  display: flex;
  flex-direction: column;
  position: absolute !important;
}

.right-bottom {
  bottom: 10px;
  right: 0px;
}

.top-left {
  top: 20px;
  left: 30px;
}

.top-center {
  top: 20px;
  left: 50%;
  transform: translate(-50%);
  z-index: 999;
}
</style>
