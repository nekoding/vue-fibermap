import type { GeoJSON } from './geom'

export interface IReportMapBandwidthAreaProperties {
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

export interface IReportMapBandwidthLinkProperties {
  id: string
  area: string
  city: string
  name: string
  pulau: string
  region: string
  segment: string
  province: string
  bandwidth: string
  occupancy: string
  utilization: string
  segment_type: string
  real_capacity: string
  cable_category: string
  utilization_range: {
    code: string
    name: string
    color: string
    type: string
    value: string
  }
  utilization_range_id: string
  length_cable_estimation: string
  line_bandwidth_ossera_real_capacity: string
  line_bandwidth_ossera_y_category_utilization: string
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
