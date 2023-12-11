'use strict'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import L from 'leaflet'
declare global {
  interface Window {
    BASE_URL?: string
  }
}

const BASE_URL = window.BASE_URL || 'http://localhost:8000/api'

const useFiberMapStore = defineStore('fibermap', () => {
  const sidebarExpandedSize = ref<number>(300)
  const sidebarCollapsedSize = ref<number>(60)
  const isSidebarCollapsed = ref<boolean>(false)

  const isMapLoaded = ref<boolean>(false)
  const mapZoomLevel = ref<number>(10)
  const mapCenter = ref<L.LatLngExpression>([-7.5487803, 111.6615726])

  const layers = ref<LayerGroup[]>([
    {
      id: 'sitepoints',
      name: 'Site Point',
      isVisible: true,
      children: []
    },
    {
      id: 'assets',
      name: 'Asset',
      isVisible: true,
      children: []
    },
    {
      id: 'routes',
      name: 'Route',
      isVisible: true,
      children: []
    },
    {
      id: 'cables',
      name: 'Cable',
      isVisible: true,
      children: []
    },
    {
      id: 'segments',
      name: 'Segment',
      isVisible: true,
      children: []
    }
  ])

  const toggleLayerVisibility = (layer: LayerGroup, parentLayer?: LayerGroup) => {
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

  const updateSitePointLayer = (sitePoints: SitePoint[]) => {
    const sitePointLayer = layers.value.find((layer) => layer.id === 'sitepoints')

    if (sitePointLayer) {
      sitePointLayer.children = sitePoints.map((sitePoint) => {
        return {
          id: sitePoint.id,
          name: sitePoint.name,
          isVisible: true
        }
      })
    }
  }

  const getSitePoints = async (mapBound: Ref<L.LatLngBounds>) => {
    const ne = mapBound.value.getNorthEast()
    const sw = mapBound.value.getSouthWest()

    const response = await fetch(
      `${BASE_URL}/sitepoints/geojson?sw_lng=${sw.lng}&sw_lat=${sw.lat}&ne_lng=${ne.lng}&ne_lat=${ne.lat}`
    )

    return await response.json()
  }

  const setSitePointLayer = (sitePoints: SitePoint[]) => {
    const sitePointLayer = layers.value.find((layer) => layer.id === 'sitepoints')

    if (sitePointLayer) {
      // flush the children
      sitePointLayer.children = []

      sitePointLayer.children = sitePoints.map((sitePoint) => {
        return {
          id: sitePoint.id,
          icon: '/icons/sitepoint.png',
          name: sitePoint.name,
          isVisible: true,
          geojson: JSON.parse(sitePoint.geojson)
        }
      })
    }
  }

  const sitePointMarkers = computed<FiberMapSitePoint[]>(() => {
    const markers: FiberMapSitePoint[] = []

    const sitePointLayer = layers.value.find((layer) => layer.id === 'sitepoints')
    if (sitePointLayer && sitePointLayer.children) {
      for (const sitePoint of sitePointLayer.children) {
        if (sitePoint.geojson) {
          const marker = L.marker(
            L.latLng(
              sitePoint.geojson.geometry.coordinates[1],
              sitePoint.geojson.geometry.coordinates[0]
            ),
            {
              icon: L.icon({
                iconUrl: sitePoint.icon ?? '',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
              })
            }
          )

          marker.bindPopup(sitePoint.name)

          markers.push({
            layer: sitePoint,
            marker
          })
        }
      }
    }

    return markers
  })

  return {
    sidebarExpandedSize,
    sidebarCollapsedSize,
    isSidebarCollapsed,
    isMapLoaded,
    mapZoomLevel,
    mapCenter,
    layers,
    sitePointMarkers,
    toggleLayerVisibility,
    updateSitePointLayer,
    getSitePoints,
    setSitePointLayer
  }
})

export { useFiberMapStore }
