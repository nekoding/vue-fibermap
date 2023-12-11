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
import { useQuery } from '@tanstack/vue-query'
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
const mapBound = ref<L.LatLngBounds>(
  L.latLngBounds(fibermapStore.mapCenter, fibermapStore.mapCenter)
)

// fetch api
const sitepointsQuery = useQuery({
  queryKey: ['sitepoints', mapBound],
  queryFn: () => fibermapStore.getSitePoints(mapBound)
})

// const assetsQuery = useQuery({
//   queryKey: ['assets', mapBound],
//   queryFn: () => fibermapStore.getAssets(mapBound)
// })

// const routesQuery = useQuery({
//   queryKey: ['routes', mapBound],
//   queryFn: () => fibermapStore.getRoutes(mapBound)
// })

// const cablesQuery = useQuery({
//   queryKey: ['cables', mapBound],
//   queryFn: () => fibermapStore.getCables(mapBound)
// })

// const segmentsQuery = useQuery({
//   queryKey: ['segments', mapBound],
//   queryFn: () => fibermapStore.getSegments(mapBound)
// })

watch(sitepointsQuery.data, (newData) => {
  if (newData) {
    fibermapStore.setSitePointLayer(newData.result.data)
  }
})

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

    // add markers to map
    map.addLayer(markers)

    // subscribe to store
    fibermapStore.$subscribe(() => {
      // update marker visible when state changed
      markers.clearLayers()
      markers.addLayers(
        fibermapStore.sitePointMarkers
          .filter((marker) => marker.layer.isVisible)
          .map((marker) => marker.marker)
      )
    })

    // set map action
    zoomInMap.value = () => map.zoomIn
    zoomOutMap.value = () => map.zoomOut
    fitToBoundMap.value = () => {
      map.fitBounds(
        L.latLngBounds(fibermapStore.sitePointMarkers.map((marker) => marker.marker.getLatLng()))
      )
    }

    // Listen to map events
    map.on('zoomend', () => {
      fibermapStore.mapZoomLevel = map.getZoom()
      fibermapStore.mapCenter = map.getCenter()
    })

    map.on('moveend', () => {
      fibermapStore.mapCenter = map.getCenter()
      mapBound.value = map.getBounds()
    })

    // set map loaded
    setTimeout(() => {
      fibermapStore.isMapLoaded = true
    }, 1000)

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
