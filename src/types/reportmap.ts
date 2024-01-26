import type { GeoJSON } from './geom'

export interface IReportMapBandwidthProperties {
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

export interface ILayer {
  id: string
  name: string
  isLayerVisible: boolean
  isVisible: boolean
  geoJSON?: GeoJSON
  children?: Array<ILayer>
  onClick?: (e: any) => void
  leafletId?: number
}
