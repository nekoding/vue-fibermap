'use strict'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { GeoJSON, GeoJSONFeature } from '@/types/geom'
import {
  cityDetailQuery,
  districtDetailQuery,
  getReportMapBandwidthFromAreaId,
  getReportMapBandwidthFromRegionId
} from '@/hooks'
import _ from 'lodash'
import L from 'leaflet'
import { toPng } from 'html-to-image'

interface ILayer {
  id: string
  name: string
  isLayerVisible: boolean
  isVisible: boolean
  geoJSON?: GeoJSON
  children?: Array<ILayer>
}

interface IReportMapBandwidthProperties {
  category_utilization: string
  city: string
  id: string
  is_lambda: string
  province: string
  pulau: string
  real_capacity: string | number
  region: string
  utilization_range: {
    code: string
    name: string
    color: string
    type: string
    value: string
  }
}

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
    }
  ])
  const sidebarCollapsedSize = ref<number>(0)
  const isSidebarCollapsed = ref<boolean>(false)
  const mapZoomLevel = ref<number>(10)
  const mapCenter = ref<L.LatLngExpression>([-6.1832151, 106.8284193])

  const getLayerById = (id: string) => layers.value.find((layer) => layer.id === id)

  const addCityGeoJsonLayer = (data: GeoJSON) => {
    const multipolygonGeojson = data as GeoJSONFeature
    const multipolygonGeojsonProps =
      multipolygonGeojson?.properties as IReportMapBandwidthProperties

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

  const resetLayers = () => {
    layers.value = [
      {
        id: 'cities',
        name: 'Cities',
        isLayerVisible: true,
        isVisible: true,
        children: []
      }
    ]
  }

  const getGeoJSONDistricts = async (ids: Array<number>) => {
    isDataFetching.value = true

    const districtAxios = ids.map((id) => districtDetailQuery(id))
    _.map(await Promise.all(districtAxios), (district) => {
      const result: any = district.data.result?.data
      if (result?.geojson === null) return
      return JSON.parse(result?.geojson) as GeoJSON
    })
      .filter((geojson) => geojson !== undefined)
      .forEach((geojson) => {
        if (geojson !== undefined) addCityGeoJsonLayer(geojson)
      })

    setTimeout(() => {
      isDataFetching.value = false
    }, 1000)
  }

  const getGeoJSONCities = async (ids: Array<number>) => {
    isDataFetching.value = true

    const cityAxios = ids.map((id) => cityDetailQuery(id))
    _.map(await Promise.all(cityAxios), (city) => {
      const result: any = city.data.result?.data
      if (result?.geojson === null) return
      return JSON.parse(result?.geojson) as GeoJSON
    })
      .filter((geojson) => geojson !== undefined)
      .forEach((geojson) => {
        if (geojson !== undefined) addCityGeoJsonLayer(geojson)
      })

    setTimeout(() => {
      isDataFetching.value = false
    }, 1000)
  }

  const getGeoJSONAreas = async (ids: Array<number>) => {
    isDataFetching.value = true

    _.map(await getReportMapBandwidthFromAreaId(ids), (reportBandwidth) => {
      const result: any = reportBandwidth.data.result?.data
      if (result?.geojson === null) return
      return JSON.parse(result?.geojson) as GeoJSON
    })
      .filter((geojson) => geojson !== undefined)
      .forEach((geojson) => {
        if (geojson !== undefined) addCityGeoJsonLayer(geojson)
      })

    setTimeout(() => {
      isDataFetching.value = false
    }, 1000)
  }

  const getGeoJSONRegions = async (ids: Array<number>) => {
    isDataFetching.value = true

    _.map(await getReportMapBandwidthFromRegionId(ids), (reportBandwidth) => {
      const result: any = reportBandwidth.data.result?.data
      if (result?.geojson === null) return
      return JSON.parse(result?.geojson) as GeoJSON
    })
      .filter((geojson) => geojson !== undefined)
      .forEach((geojson) => {
        if (geojson !== undefined) addCityGeoJsonLayer(geojson)
      })

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
    getGeoJSONDistricts,
    getGeoJSONCities,
    getGeoJSONAreas,
    getGeoJSONRegions,
    generateFiberMapReport,
    toggleLayerVisibility,
    toggleVisibility,
    getCityLayers
  }
})

export { useReportMapStore }
