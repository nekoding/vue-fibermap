<template>
  <a-layout :style="{ height: '100vh' }">
    <a-layout-sider
      v-model:collapsed="isSidebarCollapsed"
      :trigger="null"
      collapsible
      theme="light"
      :width="fibermapStore.sidebarExpandedSize"
      :collapsedWidth="fibermapStore.sidebarCollapsedSize"
      :style="{
        overflow: 'auto',
        height: '100vh',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000
      }"
    >
      <!-- Toggle sidebar -->
      <a-button
        shape="circle"
        class="toggle-sidebar"
        :class="{
          'toggle-sidebar-collapsed': isSidebarCollapsed,
          'toggle-sidebar-expanded': !isSidebarCollapsed
        }"
        @click="isSidebarCollapsed = !isSidebarCollapsed"
      >
        <left-outlined v-if="!isSidebarCollapsed" />
        <right-outlined v-else />
      </a-button>

      <a-tabs v-model:activeKey="activeKey" style="padding: 0px 10px">
        <a-tab-pane key="1">
          <template #tab>
            <span>
              <database-outlined />
              Filter Data
            </span>
          </template>

          <tab-filter />
        </a-tab-pane>

        <a-tab-pane key="2">
          <template #tab>
            <span>
              <map-icon :height="16" :width="16" />
              Map Layer
            </span>
          </template>
          <tab-map-layer />
        </a-tab-pane>
      </a-tabs>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <a-spin size="large" tip="Fetching data..." :spinning="fibermapStore.isDataFetching">
          <a-spin size="large" tip="Load Map..." :spinning="!isMapLoaded">
            <div id="overlay-map" v-show="isMapLoaded">
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
        </a-spin>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'

import MapToolset from '../components/MapToolset.vue'
import MapLegend from '../components/MapLegend.vue'
import MapSearchBar from '../components/MapSearchBar.vue'
import MapIcon from '../components/MapIcon.vue'
import TabFilter from '../modules/TabFilter.vue'
import TabMapLayer from '../modules/TabMapLayer.vue'
import { useFiberMapStore } from '../stores/fibermap'
import { LeftOutlined, RightOutlined, DatabaseOutlined } from '@ant-design/icons-vue'

const fibermapStore = useFiberMapStore()
const activeKey = ref<string>('1')
const isSidebarCollapsed = ref<boolean>(false)
const isMapLoaded = ref<boolean>(false)

const mapRef = ref<HTMLElement>()
const zoomInMap = ref<Function>(() => {})
const zoomOutMap = ref<Function>(() => {})
const fitToBoundMap = ref<Function>(() => {})
const mapBound = ref<L.LatLngBounds>(
  L.latLngBounds(fibermapStore.mapCenter, fibermapStore.mapCenter)
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
      mapBound.value = map.getBounds()
    })

    map.on('moveend', () => {
      mapBound.value = map.getBounds()
    })

    // set map loaded
    setTimeout(() => {
      isMapLoaded.value = true
    }, 1000)

    // fix map has blank space on the right side
    watch(isSidebarCollapsed, () => {
      setTimeout(() => {
        map.invalidateSize()
      }, 400)
    })
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

.toggle-sidebar {
  position: fixed;
  left: 285px;
  z-index: 1001;
  top: 20px;
  /* transition: all 0.3s; */
}

.toggle-sidebar-expanded {
  left: 285px;
}

.toggle-sidebar-collapsed {
  left: -15px;
}
</style>
