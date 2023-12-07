'use strict'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fiberMapData } from '@/data/data'
import L from 'leaflet'
import type { Layer } from '@/data/data'

const useFiberMapStore = defineStore('fibermap', () => {
  const sidebarExpandedSize = ref<number>(300)
  const sidebarCollapsedSize = ref<number>(60)
  const isSidebarCollapsed = ref<boolean>(false)

  const map = ref<L.Map>()
  const isMapLoaded = ref<boolean>(false)
  const mapZoomLevel = ref<number>(10)
  const mapCenter = ref<L.LatLngExpression>([-7.5487803, 111.6615726])

  const data = ref<Layer[]>([
    {
      name: 'Patroli',
      isVisible: true,
      children: fiberMapData.patrolis
    },
    {
      name: 'Building Point',
      isVisible: true,
      children: fiberMapData.buildings
    },
    {
      name: 'Site Point',
      isVisible: true,
      children: fiberMapData.sites
    },
    {
      name: 'Route',
      isVisible: true,
      children: fiberMapData.routes
    },
    {
      name: 'Asset Group',
      isVisible: true,
      children: fiberMapData.assetGroups
    },
    {
      name: 'Customer',
      isVisible: true,
      children: fiberMapData.customers
    }
  ])

  const toggleLayerVisibility = (layer: Layer, parentLayer?: Layer) => {
    if (parentLayer) {
      if (!parentLayer.isVisible) {
        return
      }
    }

    layer.isVisible = !layer.isVisible

    if (layer.children) {
      for (const child of layer.children) {
        toggleLayerVisibility(child)
      }
    }
  }

  return {
    sidebarExpandedSize,
    sidebarCollapsedSize,
    isSidebarCollapsed,
    map,
    isMapLoaded,
    mapZoomLevel,
    mapCenter,
    data,
    toggleLayerVisibility
  }
})

export { useFiberMapStore }
