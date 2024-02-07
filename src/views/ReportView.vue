<template>
  <a-layout>
    <a-page-header
      title="Report Fibermap"
      style="background-color: #fff; padding: 10px 12px"
      @back="gotoHomepage"
    >
      <template #backIcon>
        <a-image src="/icons/menu.svg" :preview="false" />
      </template>
    </a-page-header>
    <a-layout :style="{ height: 'calc(100vh - 68px)' }">
      <a-layout-sider
        v-model:collapsed="isSidebarCollapsed"
        :trigger="null"
        collapsible
        theme="light"
        :width="store.sidebarExpandedSize"
        :collapsedWidth="store.sidebarCollapsedSize"
        :style="{
          overflow: 'auto',
          height: 'calc(100vh - 68px)',
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
          <a-spin size="large" tip="Fetching data..." :spinning="store.isDataFetching">
            <a-spin size="large" tip="Load Map..." :spinning="!isMapLoaded">
              <div id="overlay-map" v-show="isMapLoaded">
                <div class="top-left">
                  <MapToolset
                    :zoom-in-action="zoomInMap"
                    :zoom-out-action="zoomOutMap"
                    :fit-map-action="fitToBoundMap"
                  />
                </div>
              </div>
              <div ref="mapRef" id="map"></div>
            </a-spin>
          </a-spin>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useReportMapStore } from '@/stores'
import { LeftOutlined, RightOutlined, DatabaseOutlined } from '@ant-design/icons-vue'
import MapToolset from '@/components/MapToolset.vue'
import MapIcon from '@/components/MapIcon.vue'
import TabFilter from '@/modules/report/TabFilter.vue'
import TabMapLayer from '@/modules/report/TabMapLayer.vue'
import L from 'leaflet'
import 'leaflet.markercluster'
import { createChoroplethFromAreaGeom, createLinkFromGeom, createSegmentFromGeom, createSegmentNonLambdaFromGeom } from '@/helpers'
import type { GeoJSONFeature } from '@/types'

const store = useReportMapStore()
const { layers, popupedLayer } = storeToRefs(store)
const activeKey = ref<string>('1')
const isSidebarCollapsed = ref<boolean>(false)
const isMapLoaded = ref<boolean>(false)
const mapRef = ref<HTMLDivElement>()
const zoomInMap = ref(() => {})
const zoomOutMap = ref(() => {})
const fitToBoundMap = ref(() => {})

const gotoHomepage = () => {
  window.location.href = '/'
}

// singleton map
let map: L.Map
let geojsonLayerGroups: L.FeatureGroup

onMounted(() => {
  if (mapRef.value) {
    map = L.map(mapRef.value, {
      zoomControl: false
    }).setView(store.mapCenter, store.mapZoomLevel)

    L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
      maxNativeZoom: 19,
      maxZoom: 22,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map)

    // add geojson layer group
    geojsonLayerGroups = L.featureGroup()
    geojsonLayerGroups.addTo(map)

    // set map action
    zoomInMap.value = () => map.zoomIn()
    zoomOutMap.value = () => map.zoomOut()
    fitToBoundMap.value = () => map.fitBounds(geojsonLayerGroups?.getBounds() || map.getBounds())

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

    store.mapRef = mapRef.value
  }

  // popupopen event listener
  window.addEventListener('popupopen', (e) => {
    const event = e as CustomEvent<{ id: string }>
    const { id } = event.detail
    store.setPopupedLayer(id)
  })

  // popupclose event listener
  window.addEventListener('popupclose', () => {
    store.resetPopupedLayer()
  })
})

// watch active tab
watch(
  layers,
  () => {
    // reset geojson layer if state change
    geojsonLayerGroups?.clearLayers()
    geojsonLayerGroups?.removeFrom(map)

    // city choropleth
    store.getCityLayers?.children
      ?.filter((cityLayer) => cityLayer.isLayerVisible && cityLayer.isVisible)
      .forEach((cityLayer) => {
        cityLayer.children
          ?.filter((layer) => layer.isLayerVisible && layer.isVisible)
          ?.map((layer) => {
            const geojson = layer.geoJSON as GeoJSONFeature
            return createChoroplethFromAreaGeom(geojson)
          })
          ?.forEach((layer) => geojsonLayerGroups.addLayer(layer))

        // refresh layer group
        geojsonLayerGroups.addTo(map)
      })

    // link linestring
    store.getLinkLayers?.children
      ?.filter((provinceLayer) => provinceLayer.isLayerVisible && provinceLayer.isVisible)
      .forEach((provinceLayer) => {
        provinceLayer.children
          ?.filter((cityLayer) => cityLayer.isLayerVisible && cityLayer.isVisible)
          ?.forEach((cityLayer) => {
            cityLayer.children
              ?.filter((layer) => layer.isLayerVisible && layer.isVisible)
              ?.forEach((layer) => {
                const geojson = layer.geoJSON as GeoJSONFeature
                const linkLayer = createLinkFromGeom(geojson)

                geojsonLayerGroups.addLayer(linkLayer)
              })
          })

        // refresh layer group
        geojsonLayerGroups.addTo(map)
      })

    // segment linestring
    store.getSegmentLayers?.children
      ?.filter((provinceLayer) => provinceLayer.isLayerVisible && provinceLayer.isVisible)
      .forEach((provinceLayer) => {
        provinceLayer.children
          ?.filter((cityLayer) => cityLayer.isLayerVisible && cityLayer.isVisible)
          ?.forEach((cityLayer) => {
            cityLayer.children
              ?.filter((layer) => layer.isLayerVisible && layer.isVisible)
              ?.forEach((layer) => {
                const geojson = layer.geoJSON as GeoJSONFeature
                const linkLayer = createSegmentFromGeom(geojson)

                geojsonLayerGroups.addLayer(linkLayer)
              })
          })

        // refresh layer group
        geojsonLayerGroups.addTo(map)
      })

    // segment non lambda linestring
    store.getSegmentNonLambdaLayers?.children
      ?.filter((provinceLayer) => provinceLayer.isLayerVisible && provinceLayer.isVisible)
      .forEach((provinceLayer) => {
        provinceLayer.children
          ?.filter((cityLayer) => cityLayer.isLayerVisible && cityLayer.isVisible)
          ?.forEach((cityLayer) => {
            cityLayer.children
              ?.filter((layer) => layer.isLayerVisible && layer.isVisible)
              ?.forEach((layer) => {
                const geojson = layer.geoJSON as GeoJSONFeature
                const linkLayer = createSegmentNonLambdaFromGeom(geojson)

                geojsonLayerGroups.addLayer(linkLayer)
              })
          })

        // refresh layer group
        geojsonLayerGroups.addTo(map)
      })
  },
  {
    deep: true
  }
)

// flytocoordinate
watch(popupedLayer, (value) => {
  if (map && value) {
    geojsonLayerGroups.getLayers().forEach((layer) => {
      layer.fireEvent(`popupopen:${value.id}`)
    })
  }
})
</script>

<style scoped>
#map {
  height: calc(100vh - 68px);
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
  top: 88px;
  /* transition: all 0.3s; */
}

.toggle-sidebar-expanded {
  left: 285px;
}

.toggle-sidebar-collapsed {
  left: -15px;
}
</style>
