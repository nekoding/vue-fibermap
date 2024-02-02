'use strict'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { GeoJSON, GeoJSONFeature } from '@/types/geom'
import {
  getReportMapBandwidthAreas,
  getReportMapBandwidthLinks,
  getReportMapBandwidthSegments
} from '@/hooks'
import _ from 'lodash'
import L from 'leaflet'
import { toPng } from 'html-to-image'
import type {
  ILayer,
  IReportMapBandwidthAreaProperties,
  IReportMapBandwidthLinkProperties,
  LayerGroup
} from '@/types'

const useReportMapStore = defineStore('useReportMapStore', () => {
  const mapRef = ref<HTMLDivElement>()
  const sidebarExpandedSize = ref<number>(300)
  const isDataFetching = ref<boolean>(false)
  const layers = ref<ILayer[]>([
    {
      id: 'cities',
      name: 'Cities',
      isLayerVisible: true,
      isVisible: true,
      children: []
    },
    {
      id: 'links',
      name: 'Links',
      isLayerVisible: true,
      isVisible: true,
      children: []
    },
    {
      id: 'segments',
      name: 'Segments',
      isLayerVisible: true,
      isVisible: true,
      children: []
    }
  ])
  const sidebarCollapsedSize = ref<number>(0)
  const isSidebarCollapsed = ref<boolean>(false)
  const mapZoomLevel = ref<number>(5.38)
  const mapCenter = ref<L.LatLngExpression>([-1.725324, 114.1358624])
  const popupedLayer = ref<ILayer | null>(null)

  const getLayerById = (id: string) => layers.value.find((layer) => layer.id === id)

  const addCityGeoJsonLayer = (data: GeoJSON) => {
    const multipolygonGeojson = data as GeoJSONFeature
    const multipolygonGeojsonProps =
      multipolygonGeojson?.properties as IReportMapBandwidthAreaProperties

    // check if layer province is already exist
    const cityLayer = getLayerById('cities')
    const provinceLayer = cityLayer?.children?.find(
      (child) => child.id === multipolygonGeojsonProps.province
    )

    const layer: ILayer = {
      id: multipolygonGeojsonProps.id || '',
      name: multipolygonGeojsonProps.city || '',
      isLayerVisible: true,
      isVisible: true,
      geoJSON: data
    }

    // onclick layer
    layer.onClick = () => {
      // set popuped layer
      popupedLayer.value = layer
    }

    if (provinceLayer) {
      provinceLayer.children?.push(layer)
    } else {
      const newProvinceLayer: ILayer = {
        id: multipolygonGeojsonProps.province || multipolygonGeojsonProps.id,
        name: multipolygonGeojsonProps.province,
        isLayerVisible: true,
        isVisible: true,
        children: [layer]
      }

      cityLayer?.children?.push(newProvinceLayer)
    }
  }

  const addLinkGeoJsonLayer = (data: GeoJSON) => {
    const lineStringGeojson = data as GeoJSONFeature
    const lineStringGeojsonProps =
      lineStringGeojson?.properties as IReportMapBandwidthLinkProperties

    const linkLayer = getLayerById('links')

    // province - city - link
    const provinceLayer = linkLayer?.children?.find(
      (child) => child.id === lineStringGeojsonProps.province
    )
    const cityLayer = provinceLayer?.children?.find(
      (child) => child.id === lineStringGeojsonProps.city
    )

    // link layer config
    const layer: ILayer = {
      id: lineStringGeojsonProps.id || '',
      name: lineStringGeojsonProps.name || '',
      isLayerVisible: true,
      isVisible: true,
      geoJSON: data
    }

    // onclick layer
    layer.onClick = () => (popupedLayer.value = layer)

    if (cityLayer) {
      cityLayer.children?.push(layer)
      return
    }

    if (provinceLayer) {
      const newCityLayer: ILayer = {
        id: lineStringGeojsonProps.city || lineStringGeojsonProps.id,
        name: lineStringGeojsonProps.city,
        isLayerVisible: true,
        isVisible: true,
        children: [layer]
      }

      provinceLayer.children?.push(newCityLayer)
      return
    }

    const newCityLayer: ILayer = {
      id: lineStringGeojsonProps.city || lineStringGeojsonProps.id,
      name: lineStringGeojsonProps.city,
      isLayerVisible: true,
      isVisible: true,
      children: [layer]
    }

    const newProvinceLayer: ILayer = {
      id: lineStringGeojsonProps.province || lineStringGeojsonProps.id,
      name: lineStringGeojsonProps.province,
      isLayerVisible: true,
      isVisible: true,
      children: [newCityLayer]
    }

    linkLayer?.children?.push(newProvinceLayer)
  }

  const addSegmentGeoJsonLayer = (data: GeoJSON) => {
    const lineStringGeojson = data as GeoJSONFeature
    const lineStringGeojsonProps =
      lineStringGeojson?.properties as IReportMapBandwidthLinkProperties

    const segmentLayer = getLayerById('segments')

    // province - city - link
    const provinceLayer = segmentLayer?.children?.find(
      (child) => child.id === lineStringGeojsonProps.province
    )
    const cityLayer = provinceLayer?.children?.find(
      (child) => child.id === lineStringGeojsonProps.city
    )

    // link layer config
    const layer: ILayer = {
      id: lineStringGeojsonProps.id || '',
      name: lineStringGeojsonProps.name || '',
      isLayerVisible: true,
      isVisible: true,
      geoJSON: data
    }

    // onclick layer
    layer.onClick = () => (popupedLayer.value = layer)

    if (cityLayer) {
      cityLayer.children?.push(layer)
      return
    }

    if (provinceLayer) {
      const newCityLayer: ILayer = {
        id: lineStringGeojsonProps.city || lineStringGeojsonProps.id,
        name: lineStringGeojsonProps.city,
        isLayerVisible: true,
        isVisible: true,
        children: [layer]
      }

      provinceLayer.children?.push(newCityLayer)
      return
    }

    const newCityLayer: ILayer = {
      id: lineStringGeojsonProps.city || lineStringGeojsonProps.id,
      name: lineStringGeojsonProps.city,
      isLayerVisible: true,
      isVisible: true,
      children: [layer]
    }

    const newProvinceLayer: ILayer = {
      id: lineStringGeojsonProps.province || lineStringGeojsonProps.id,
      name: lineStringGeojsonProps.province,
      isLayerVisible: true,
      isVisible: true,
      children: [newCityLayer]
    }

    segmentLayer?.children?.push(newProvinceLayer)
  }

  const parseReportMapBandwidthCity = (data: []) => {
    _.map(data, (reportBandwidth) => {
      const result: any = reportBandwidth
      if (result?.geojson === null) return
      return JSON.parse(result?.geojson) as GeoJSON
    })
      .filter((geojson) => geojson !== undefined)
      .forEach((geojson) => {
        if (geojson !== undefined) addCityGeoJsonLayer(geojson)
      })
  }

  const parseReportMapBandwidthLink = (data: []) => {
    _.map(data, (reportBandwidth) => {
      const result: any = reportBandwidth
      if (result?.geojson === null) return
      return JSON.parse(result?.geojson) as GeoJSON
    })
      .filter((geojson) => geojson !== undefined)
      .forEach((geojson) => {
        if (geojson !== undefined) addLinkGeoJsonLayer(geojson)
      })
  }

  const parseReportMapBandwidthSegment = (data: []) => {
    _.map(data, (reportBandwidth) => {
      const result: any = reportBandwidth
      if (result?.geojson === null) return
      return JSON.parse(result?.geojson) as GeoJSON
    })
      .filter((geojson) => geojson !== undefined)
      .forEach((geojson) => {
        if (geojson !== undefined) addSegmentGeoJsonLayer(geojson)
      })
  }

  const resetLayers = () => {
    layers.value.forEach((layer) => {
      layer.isLayerVisible = true
      layer.isVisible = true
      layer.children = []
    })
  }

  const getGeoJSONReport = async ({
    regionIds,
    areaIds,
    cityIds
  }: {
    regionIds: Array<number>
    areaIds: Array<number>
    cityIds: Array<number>
  }) => {
    isDataFetching.value = true

    const [bandwidthAreas, bandwidthLinks, bandwidthSegments] = await Promise.all([
      getReportMapBandwidthAreas({ regionIds, areaIds, cityIds }),
      getReportMapBandwidthLinks({ regionIds, areaIds, cityIds }),
      getReportMapBandwidthSegments({ regionIds, areaIds, cityIds })
    ])

    // parsing bandwidth city area
    parseReportMapBandwidthCity(bandwidthAreas.result?.data || [])

    // parsing bandwidth link
    parseReportMapBandwidthLink(bandwidthLinks.result?.data || [])

    // parsing bandwidth segments
    parseReportMapBandwidthSegment(bandwidthSegments.result?.data || [])

    setTimeout(() => {
      isDataFetching.value = false
    }, 1000)
  }

  const generateFiberMapReport = async () => {
    const image = await toPng(mapRef.value!, { cacheBust: true })
    const downloadButton = document.createElement('a')
    downloadButton.href = image
    downloadButton.download = 'report-fibermap.png'
    downloadButton.click()
  }

  const toggleVisibility = (layer: LayerGroup, parentLayer?: LayerGroup) => {
    if (parentLayer) {
      if (!parentLayer.isVisible) {
        return
      }
    }

    layer.isVisible = !layer.isVisible

    const toggleLayerStatus = (layer: LayerGroup, isActive: boolean) => {
      layer.isVisible = isActive

      if (layer.children) {
        for (const child of layer.children) {
          toggleLayerStatus(child, isActive)
        }
      }
    }

    if (layer.children) {
      for (const child of layer.children) {
        toggleLayerStatus(child, layer.isVisible)
      }
    }
  }

  const toggleLayerVisibility = (selectedLayerIds: string[]) => {
    const toggleAllLayer = (layer: LayerGroup, isActive: boolean) => {
      layer.isLayerVisible = isActive

      if (layer.children) {
        for (const child of layer.children) {
          toggleAllLayer(child, isActive)
        }
      }
    }

    if (selectedLayerIds.length === 0) {
      // toggle all layer to on
      for (const layer of layers.value) {
        toggleAllLayer(layer, true)
      }
      return
    }

    // toggle all layer to off
    for (const layer of layers.value) {
      toggleAllLayer(layer, false)
    }

    for (const selectedLayerId of selectedLayerIds) {
      const [parentLayerId, childLayerId, grandchildLayerId] = selectedLayerId.split('-')
      const parentLayer = layers.value.find((layer) => layer.id === parentLayerId)
      if (parentLayer) {
        parentLayer.isLayerVisible = true

        if (childLayerId) {
          const childLayer = parentLayer.children?.find((layer) => layer.id == childLayerId)

          if (childLayer) {
            childLayer.isLayerVisible = true

            if (grandchildLayerId) {
              const grandchildLayer = childLayer.children?.find(
                (layer) => layer.id == grandchildLayerId
              )

              if (grandchildLayer) {
                grandchildLayer.isLayerVisible = true
              }
            }
          }
        }
      }
    }
  }

  const getCityLayers = computed(() => getLayerById('cities'))

  const getLinkLayers = computed(() => getLayerById('links'))

  const getSegmentLayers = computed(() => getLayerById('segments'))

  const setPopupedLayer = (id: string) => {
    const children = getCityLayers.value?.children
    if (children?.length) {
      let currentIndex = 0
      while (currentIndex < children.length) {
        const provinceLayer = children[currentIndex]
        const cityLayer = provinceLayer.children?.find((layer) => layer.id === id)
        if (cityLayer) {
          popupedLayer.value = cityLayer
          break
        }

        currentIndex++
      }
    }
  }

  const resetPopupedLayer = () => {
    popupedLayer.value = null
  }

  return {
    mapRef,
    sidebarExpandedSize,
    isDataFetching,
    layers,
    sidebarCollapsedSize,
    isSidebarCollapsed,
    mapZoomLevel,
    mapCenter,
    addCityGeoJsonLayer,
    resetLayers,
    getGeoJSONReport,
    generateFiberMapReport,
    toggleLayerVisibility,
    toggleVisibility,
    getCityLayers,
    popupedLayer,
    setPopupedLayer,
    resetPopupedLayer,
    getLinkLayers,
    getSegmentLayers
  }
})

export { useReportMapStore }
