interface LayerGroup {
  id: string | number
  name: string
  isVisible: boolean
  geojson?: {
    type: string
    geometry: {
      type: string
      coordinates: number[]
    }
    properties: object
  }
  children?: LayerGroup[]
  icon?: string
}

interface SitePoint {
  id: string | number
  name: string
  village_id: string | number
  site_category_id: string | number
  geojson: string
}

interface FiberMapSitePoint {
  layer: LayerGroup
  marker: L.Marker
}
