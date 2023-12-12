interface LayerGroup {
  id: string | number
  name: string
  isVisible: boolean
  geojson?: {
    type: string
    geometry:
      | {
          type: 'Point'
          coordinates: number[]
        }
      | {
          type: 'LineString'
          coordinates: number[][]
        }
    properties: object
  }
  children?: LayerGroup[]
  icon?: string
  color?: string
}

interface SitePoint {
  id: string | number
  name: string
  village_id: string | number
  site_category_id: string | number
  geojson: string
}

interface AssetGroup {
  id: string | number
  name: string
  asset_id: string | number
  asset_name: string
  asset_description?: string
  asset_category_id: string | number
  asset_category_name: string
  asset_icon?: string
  geojson: string
}

interface Route {
  id: string | number
  name: string
  length?: number
  route_method_id?: number
  route_ownership_id?: number
  geojson: string
}

interface FiberMapSitePoint {
  layer: LayerGroup
  marker: L.Marker
}

interface FiberMapAssetGroup {
  layer: LayerGroup
  marker: L.Marker
}

interface FiberMapRoute {
  layer: LayerGroup
  polyline: L.Polyline
}
