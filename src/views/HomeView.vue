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
      <div class="top-right"></div>
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
import { notification } from 'ant-design-vue'
import { useSitepointQuery, useAssetGroupQuery, useRouteQuery } from '../hooks/hooks'

const fibermapStore = useFiberMapStore()
const mapRef = ref<HTMLElement>()
const zoomInMap = ref<Function>(() => {})
const zoomOutMap = ref<Function>(() => {})
const fitToBoundMap = ref<Function>(() => {})
const mapBound = ref<L.LatLngBounds>(
  L.latLngBounds(fibermapStore.mapCenter, fibermapStore.mapCenter)
)

const { data: dataSitePoint, error: sitePointError } = useSitepointQuery(mapBound)
const { data: dataAssetGroup, error: assetGroupError } = useAssetGroupQuery(mapBound)
const { data: dataRoute, error: routeError } = useRouteQuery(mapBound)

watch(
  [dataSitePoint, dataAssetGroup, dataRoute, sitePointError, assetGroupError, routeError],
  ([sitepoint, assetGroup, route, sitepointError, assetGroupError, routeError]) => {
    console.log(sitepoint?.status)

    if (sitepoint?.status == 200) {
      fibermapStore.setSitePointLayer(sitepoint.data?.result?.data)
    }

    if (assetGroup?.status == 200) {
      fibermapStore.setAssetGroupLayer(assetGroup.data?.result?.data)
    }

    if (route?.status == 200) {
      fibermapStore.setRouteLayer(route.data?.result?.data)
    }
  }
)

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

      markers.addLayers(
        fibermapStore.assetMarkers
          .filter((marker) => marker.layer.isVisible)
          .map((marker) => marker.marker)
      )

      markers.addLayers(
        fibermapStore.routePolylines
          .filter((polyline) => polyline.layer.isVisible)
          .map((polyline) => polyline.polyline)
      )
    })

    // set map action
    zoomInMap.value = () => {
      map.zoomIn()
    }

    zoomOutMap.value = () => {
      map.zoomOut()
    }

    fitToBoundMap.value = () => {
      map.fitBounds(
        L.latLngBounds(fibermapStore.sitePointMarkers.map((marker) => marker.marker.getLatLng()))
      )
    }

    // Listen to map events
    map.on('zoomend', () => {
      // mapBound.value = map.getBounds()
    })

    map.on('moveend', () => {
      // mapBound.value = map.getBounds()
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
.top-center,
.top-right {
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

.top-right {
  top: 20px;
  right: 30px;
}
</style>
