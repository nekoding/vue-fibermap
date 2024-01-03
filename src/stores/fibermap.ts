'use strict'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import L from 'leaflet'
import type { TreeSelectProps } from 'ant-design-vue'

const useFiberMapStore = defineStore('fibermap', () => {
  const sidebarExpandedSize = ref<number>(300)
  const sidebarCollapsedSize = ref<number>(0)
  const isSidebarCollapsed = ref<boolean>(false)

  const isDataFetching = ref<boolean>(false)
  const mapZoomLevel = ref<number>(10)
  const mapCenter = ref<L.LatLngExpression>([-6.1832151, 106.8284193])

  const popupedLayer = ref<LayerGroup | null>(null)
  const selectedLayers = ref([])
  const layers = ref<LayerGroup[]>([
    {
      id: 'sitepoints',
      name: 'Site Point',
      isLayerVisible: true,
      isVisible: true,
      children: []
    },
    {
      id: 'assets',
      name: 'Asset',
      isLayerVisible: true,
      isVisible: true,
      children: []
    },
    {
      id: 'routes',
      name: 'Route',
      isLayerVisible: true,
      isVisible: true,
      children: []
    },
    {
      id: 'cables',
      name: 'Cable',
      isLayerVisible: true,
      isVisible: true,
      children: []
    },
    {
      id: 'segments',
      name: 'Segment',
      isLayerVisible: true,
      isVisible: true,
      children: []
    }
  ])

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

  const updateSitePointLayer = (sitePoints: SitePoint[]) => {
    const sitePointLayer = layers.value.find((layer) => layer.id === 'sitepoints')

    if (sitePointLayer) {
      sitePointLayer.children = sitePoints.map((sitePoint) => {
        return {
          id: sitePoint.id,
          name: sitePoint.name,
          isVisible: true,
          isLayerVisible: true
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
          isLayerVisible: true,
          isVisible: true,
          geojson: JSON.parse(sitePoint.geojson),
          code: sitePoint.code ?? ''
        }
      })
    }
  }

  const setAssetLayer = (assets: Asset[]) => {
    const assetLayer = layers.value.find((layer) => layer.id === 'assets')

    if (assetLayer) {
      // flush the children
      assetLayer.children = []

      // grouping data by asset group
      assets.reduce((acc, asset) => {
        const current = acc.find((item) => item.id === asset.asset_group_id)
        if (current) {
          current.children?.push({
            id: asset.id,
            name: asset.name,
            icon: asset.asset_icon ?? '/icons/odp.png',
            isLayerVisible: true,
            isVisible: true,
            geojson: JSON.parse(asset.geojson),
            code: asset.code ?? ''
          })
        } else {
          acc.push({
            id: asset.asset_group_id,
            name: asset.asset_group_name,
            icon: asset.asset_icon ?? '/icons/odp.png',
            isLayerVisible: true,
            isVisible: true,
            children: [
              {
                id: asset.id,
                name: asset.name,
                icon: asset.asset_icon ?? '/icons/odp.png',
                isLayerVisible: true,
                isVisible: true,
                geojson: JSON.parse(asset.geojson),
                code: asset.code ?? ''
              }
            ]
          })
        }

        return acc
      }, assetLayer.children)
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
          isLayerVisible: true,
          isVisible: true,
          geojson: JSON.parse(route.geojson),
          icon: '/icons/route.png',
          color: '#EF4040'
        }
      })
    }
  }

  const setCableLayer = (cables: Cable[]) => {
    const cableLayer = layers.value.find((layer) => layer.id === 'cables')

    if (cableLayer) {
      // flush children
      cableLayer.children = []

      // grouping data by cable group
      cables.reduce((acc, cable) => {
        const current = acc.find((item) => item.id === cable.cable_group_id)
        if (current) {
          current.children?.push({
            id: cable.id,
            name: cable.name,
            isLayerVisible: true,
            isVisible: true,
            geojson: JSON.parse(cable.geojson),
            icon: '/icons/cable.png',
            color: '#3559E0',
            code: cable.code ?? ''
          })
        } else {
          acc.push({
            id: cable.cable_group_id,
            name: cable.cable_group_name,
            icon: '/icons/cable.png',
            isLayerVisible: true,
            isVisible: true,
            children: [
              {
                id: cable.id,
                name: cable.name,
                isLayerVisible: true,
                isVisible: true,
                geojson: JSON.parse(cable.geojson),
                icon: '/icons/cable.png',
                color: '#3559E0',
                code: cable.code ?? ''
              }
            ]
          })
        }

        return acc
      }, cableLayer.children)
    }
  }

  const setSegmentLayer = (segments: Segment[]) => {
    const segmentLayer = layers.value.find((layer) => layer.id === 'segments')

    if (segmentLayer) {
      // flush children
      segmentLayer.children = []

      segmentLayer.children = segments.map((segment) => {
        return {
          id: segment.id,
          name: segment.name,
          isLayerVisible: true,
          isVisible: true,
          geojson: JSON.parse(segment.geojson),
          icon: '/icons/segment.png',
          color: '#191919',
          code: segment.code ?? ''
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
          const geojson = sitePoint.geojson as Feature
          const geometry = geojson.geometry as Point
          const coordinates = geometry.coordinates as [number, number]
          const marker = L.marker(L.latLng(coordinates[1], coordinates[0]), {
            icon: L.icon({
              iconUrl: sitePoint.icon ?? '',
              iconSize: [32, 32],
              iconAnchor: [16, 32]
            })
          })

          const popupContent = `<p><strong>Name:</strong> ${sitePoint.name}</p><p><strong>Code:</strong> ${sitePoint.code}</p>`

          marker.bindPopup(popupContent)

          sitePoint.onClick = () => {
            marker.fireEvent('flytocoordinate')
          }

          marker.addEventListener('popupopen', function () {
            popupedLayer.value = sitePoint
          })

          marker.addEventListener('popupclose', function () {
            popupedLayer.value = null
          })

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

    const addAssetGroup = (assetGroup: LayerGroup) => {
      if (assetGroup.children) {
        for (const child of assetGroup.children) {
          addAssetGroup(child)
        }
      }

      if (assetGroup.geojson) {
        const geojson = assetGroup.geojson as Feature
        const geometry = geojson.geometry as Point
        const coordinates = geometry.coordinates
        const marker = L.marker(L.latLng(coordinates[1], coordinates[0]), {
          icon: L.icon({
            iconUrl: assetGroup.icon ?? '',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          })
        })

        const popupContent = `<p><strong>Name:</strong> ${assetGroup.name}</p><p><strong>Code:</strong> ${assetGroup.code}</p>`
        marker.bindPopup(popupContent)

        assetGroup.onClick = () => marker.fireEvent('flytocoordinate')

        marker.addEventListener('popupopen', function () {
          popupedLayer.value = assetGroup
        })

        marker.addEventListener('popupclose', function () {
          popupedLayer.value = null
        })

        markers.push({
          layer: assetGroup,
          marker
        })
      }
    }

    const assetGroupLayer = layers.value.find((layer) => layer.id === 'assets')
    if (assetGroupLayer && assetGroupLayer.children) {
      for (const assetGroup of assetGroupLayer.children) {
        addAssetGroup(assetGroup)
      }
    }

    return markers
  })

  const routePolylines = computed<FiberMapRoute[]>(() => {
    const routes: FiberMapRoute[] = []

    const routeLayer = layers.value.find((layer) => layer.id === 'routes')
    if (routeLayer && routeLayer.children) {
      for (const route of routeLayer.children) {
        const geojson = route.geojson as Feature
        if (geojson && geojson.geometry) {
          // mapping data to be polyline coord
          const geometry = geojson.geometry as LineString
          const line = geometry.coordinates.map((coordinate) => {
            if (Array.isArray(coordinate)) {
              return [coordinate[1], coordinate[0]]
            }
          }) as [number, number][]

          const polyline = L.polyline(line, {
            color: route.color ?? '#ff0000'
          })

          const popupContent = `<p><strong>Name:</strong> ${route.name}</p>`
          polyline.bindPopup(popupContent)

          route.onClick = () => polyline.fireEvent('flytocoordinate')

          polyline.addEventListener('popupopen', function () {
            popupedLayer.value = route
          })

          polyline.addEventListener('popupclose', function () {
            popupedLayer.value = null
          })

          routes.push({
            layer: route,
            polyline
          })
        }
      }
    }

    return routes
  })

  const cablePolylines = computed<FiberMapCable[]>(() => {
    const cables: FiberMapCable[] = []

    const addCableGroup = (cable: LayerGroup) => {
      if (cable.children) {
        for (const child of cable.children) {
          addCableGroup(child)
        }
      }

      if (cable.geojson) {
        const geojson = cable.geojson as FeatureCollection
        if (geojson) {
          // mapping data to be polyline coord
          const features = geojson.features
          for (const feature of features) {
            const line = feature.geometry.coordinates.map((coordinate) => {
              if (Array.isArray(coordinate)) {
                return [coordinate[1], coordinate[0]]
              }
            }) as [number, number][]

            const polyline = L.polyline(line, {
              color: cable.color ?? '#ff0000'
            })

            const popupContent = `<p><strong>Name:</strong> ${cable.name}</p><p><strong>Code:</strong> ${cable.code}</p>`
            polyline.bindPopup(popupContent)

            cable.onClick = () => polyline.fireEvent('flytocoordinate')

            polyline.addEventListener('popupopen', function () {
              popupedLayer.value = cable
            })

            polyline.addEventListener('popupclose', function () {
              popupedLayer.value = null
            })

            cables.push({
              layer: cable,
              polyline
            })
          }
        }
      }
    }

    const cableLayer = layers.value.find((layer) => layer.id === 'cables')
    if (cableLayer && cableLayer.children) {
      for (const cable of cableLayer.children) {
        addCableGroup(cable)
      }
    }
    return cables
  })

  const segmentPolylines = computed<FiberMapSegment[]>(() => {
    const segments: FiberMapSegment[] = []

    const segmentLayer = layers.value.find((layer) => layer.id === 'segments')
    if (segmentLayer && segmentLayer.children) {
      for (const segment of segmentLayer.children) {
        const geojson = segment.geojson as FeatureCollection
        if (geojson) {
          // mapping data to be polyline coord
          const features = geojson.features
          for (const feature of features) {
            const line = feature.geometry.coordinates.map((coordinate) => {
              if (Array.isArray(coordinate)) {
                return [coordinate[1], coordinate[0]]
              }
            }) as [number, number][]

            const polyline = L.polyline(line, {
              color: segment.color ?? '#ff0000'
            })

            const popupContent = `<p><strong>Name:</strong> ${segment.name}</p><p><strong>Code:</strong> ${segment.code}</p>`
            polyline.bindPopup(popupContent)

            segment.onClick = () => polyline.fireEvent('flytocoordinate')

            polyline.addEventListener('popupopen', function () {
              popupedLayer.value = segment
            })

            polyline.addEventListener('popupclose', function () {
              popupedLayer.value = null
            })

            segments.push({
              layer: segment,
              polyline
            })
          }
        }
      }
    }

    return segments
  })

  const mapLegends = computed<MapLegend[]>(() => {
    return [
      {
        id: 'sitepoints',
        name: 'Site Point',
        icon: '/icons/sitepoint.png'
      },
      {
        id: 'assets',
        name: 'Asset',
        icon: '/icons/odp.png'
      },
      {
        id: 'routes',
        name: 'Route',
        icon: '/icons/route.png'
      },
      {
        id: 'cables',
        name: 'Cable',
        icon: '/icons/cable.png'
      },
      {
        id: 'segments',
        name: 'Segment',
        icon: '/icons/segment.png'
      }
    ]
  })

  const treeLayerOptions = computed<TreeSelectProps['treeData']>(() => {
    return layers.value.map((layer) => {
      return {
        label: layer.name,
        value: layer.id,
        children: layer.children?.map((child) => {
          return {
            label: child.name,
            value: `${layer.id}-${child.id}`,
            children: child.children?.map((grandchild) => {
              return {
                label: grandchild.name,
                value: `${layer.id}-${child.id}-${grandchild.id}`
              }
            })
          }
        })
      }
    })
  })

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

  return {
    sidebarExpandedSize,
    sidebarCollapsedSize,
    isSidebarCollapsed,
    isDataFetching,
    mapZoomLevel,
    mapCenter,
    popupedLayer,
    selectedLayers,
    layers,
    sitePointMarkers,
    assetMarkers,
    routePolylines,
    cablePolylines,
    segmentPolylines,
    mapLegends,
    toggleVisibility,
    updateSitePointLayer,
    setSitePointLayer,
    setAssetLayer,
    setRouteLayer,
    setCableLayer,
    setSegmentLayer,
    treeLayerOptions,
    toggleLayerVisibility
  }
})

export { useFiberMapStore }
