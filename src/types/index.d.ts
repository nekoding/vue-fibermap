interface Point {
  type: 'Point'
  coordinates: number[]
}

interface LineString {
  type: 'LineString'
  coordinates: number[][]
}

interface Feature {
  type: string
  geometry: Point | LineString
  properties: object
}

interface FeatureCollection {
  type: 'FeatureCollection'
  features: Feature[]
}

interface LayerGroup {
  id: string | number
  name: string
  isVisible: boolean
  geojson?: Feature | FeatureCollection
  children?: LayerGroup[]
  icon?: string
  color?: string
  code?: string
}

interface ApiResponse {
  message: string
  result?: {
    data?: []
    links?: {
      first: string
      last: string
      prev: string
      next: string
    }
    meta?: {
      current_page: number
      from: number
      last_page: number
      path: string
      per_page: number
      to: number
      total: number
    }
  }
  errors?: any
}

interface SitePoint {
  id: string | number
  name: string
  code?: string
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

interface Asset {
  id: string | number
  name: string
  code?: string
  description?: string
  asset_group_id: string | number
  asset_category_id: string | number
  asset_group_name: string
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

interface Cable {
  id: string | number
  name: string
  code?: string
  description?: string
  cable_group_id: string | number
  cable_group_name: string
  geojson: string
}

interface Segment {
  id: string | number
  name: string
  code?: string
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

interface FiberMapCable {
  layer: LayerGroup
  polyline: L.Polyline
}

interface FiberMapSegment {
  layer: LayerGroup
  polyline: L.Polyline
}

interface MapLegend {
  id: string | number
  name: string
  icon?: string
}