'use strict'
import { defineStore } from 'pinia'
import type L from 'leaflet'
import { computed, ref } from 'vue'

const useMapStore = defineStore('map', () => {
  const mapContainer = ref<HTMLDivElement>()
  const isSidebarCollapsed = ref<boolean>(false)
  const isMapLoaded = ref<boolean>(false)
  const map = ref<L.Map>()
  const zoomLevel = ref<number>(5)
  const center = ref<L.LatLngExpression>([-3.8511816, 110.4192163])

  const getZoomLevel = computed(() => zoomLevel.value + 'z')
  const getCenter = computed(() => center.value)

  const zoomInAction = () => map.value?.zoomIn(1)
  const zoomOutAction = () => map.value?.zoomOut(1)
  const fitMapAction = () => map.value?.setZoom(5)

  return {
    mapContainer,
    isSidebarCollapsed,
    isMapLoaded,
    map,
    zoomLevel,
    center,
    getZoomLevel,
    getCenter,
    zoomInAction,
    zoomOutAction,
    fitMapAction
  }
})

export { useMapStore }
