'use strict'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  getFibermapSitepoints,
  getFibermapAssetGroups,
  getFibermapRoutes
} from '../actions/fibermapActions'
import L from 'leaflet'

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

  const setAssetGroupLayer = (assetGroups: AssetGroup[]) => {
    const assetGroupLayer = layers.value.find((layer) => layer.id === 'assets')

    if (assetGroupLayer) {
      // flush the children
      assetGroupLayer.children = []

      // grouping data by asset group
      assetGroups.reduce((acc, assetGroup) => {
        const current = acc.find((item) => item.id === assetGroup.id)
        if (current) {
          current.children?.push({
            id: assetGroup.asset_id,
            name: assetGroup.asset_name,
            icon: assetGroup.asset_icon ?? '/icons/odp.png',
            isVisible: true,
            geojson: JSON.parse(assetGroup.geojson)
          })
        } else {
          acc.push({
            id: assetGroup.id,
            name: assetGroup.name,
            icon: assetGroup.asset_icon ?? '/icons/odp.png',
            isVisible: true,
            children: [
              {
                id: assetGroup.asset_id,
                name: assetGroup.asset_name,
                icon: assetGroup.asset_icon ?? '/icons/odp.png',
                isVisible: true,
                geojson: JSON.parse(assetGroup.geojson)
              }
            ]
          })
        }

        return acc
      }, assetGroupLayer.children)
    }
  }

  const setRouteLayer = (routes: Route[]) => {
    const routeLayer = layers.value.find((layer) => layer.id === 'routes')

    if (routeLayer) {
      // flush the children
      routeLayer.children = []

      routeLayer.children = routes.map((route) => {
        return {
          id: route.id,
          name: route.name,
          isVisible: true,
          geojson: JSON.parse(route.geojson),
          color: '#ff0000'
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

  const assetMarkers = computed<FiberMapAssetGroup[]>(() => {
    const markers: FiberMapAssetGroup[] = []

    const addAssetGroup = (assetGroup: LayerGroup, memo: FiberMapAssetGroup[]) => {
      if (assetGroup.children) {
        for (const child of assetGroup.children) {
          addAssetGroup(child, memo)
        }
      }

      if (assetGroup.geojson) {
        const marker = L.marker(
          L.latLng(
            assetGroup.geojson.geometry.coordinates[1],
            assetGroup.geojson.geometry.coordinates[0]
          ),
          {
            icon: L.icon({
              iconUrl: assetGroup.icon ?? '',
              iconSize: [32, 32],
              iconAnchor: [16, 32]
            })
          }
        )

        marker.bindPopup(assetGroup.name)

        markers.push({
          layer: assetGroup,
          marker
        })
      }
    }

    const assetGroupLayer = layers.value.find((layer) => layer.id === 'assets')
    if (assetGroupLayer && assetGroupLayer.children) {
      for (const assetGroup of assetGroupLayer.children) {
        addAssetGroup(assetGroup, markers)
      }
    }

    return markers
  })

  const routePolylines = computed<FiberMapRoute[]>(() => {
    const routes: FiberMapRoute[] = []

    const routeLayer = layers.value.find((layer) => layer.id === 'routes')
    if (routeLayer && routeLayer.children) {
      for (const route of routeLayer.children) {
        const geojson = route.geojson
        if (geojson && geojson.geometry) {
          // mapping data to be polyline coord
          const line = geojson.geometry.coordinates.map((coordinate) => {
            if (Array.isArray(coordinate)) {
              return coordinate.reverse()
            }
          }) as [number, number][]

          const polyline = L.polyline(line, {
            color: route.color ?? '#ff0000'
          })

          polyline.bindPopup(route.name)

          routes.push({
            layer: route,
            polyline
          })
        }
      }
    }

    return routes
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
    assetMarkers,
    routePolylines,
    toggleLayerVisibility,
    updateSitePointLayer,
    getFibermapSitepoints,
    getFibermapAssetGroups,
    getFibermapRoutes,
    setSitePointLayer,
    setAssetGroupLayer,
    setRouteLayer
  }
})

export { useFiberMapStore }
