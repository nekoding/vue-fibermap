import type { GeoJSON } from './geom'

export interface IReportMapBandwidthAreaProperties {
  id: string
  area?: string
  city?: string
  region?: string
  kode_kab?: string
  province?: string
  is_lambda?: string
  total_tam?: string
  jumlah_sia?: string
  panjang_fo?: string
  jumlah_opty?: string
  total_saldo?: string
  primary_link?: string
  primary_capacity?: string
  category_utilization?: string
  utilization_range?: {
    code: string
    name: string
    color: string
    type: string
    value: string
  }
}

export interface IReportMapBandwidthLinkProperties {
  id: string
  area?: string
  city?: string
  pulau?: string
  region?: string
  province?: string
  device_type?: string
  jenis_trunk?: string
  unique_link?: string
  primary_link?: string
  segment_city?: string
  provider_name?: string
  bandwidth_mbps?: string
  occupancy_mbps?: string
  segment_lambda?: string
  primary_capacity?: string
  utilization_range?: {
    code: string
    name: string
    color: string
    type: string
    value: string
  }
  category_utilization?: string
  length_cable_estimation?: string
}

export interface IReportMapBandwidthSegmentProperties {
  id: string
  pop?: string
  area?: string
  city?: string
  pulau?: string
  region?: string
  pic_name?: string
  province?: string
  total_sia?: string
  cable_core?: string
  cable_name?: string
  total_opty?: string
  total_trunk?: string
  cable_category?: string
  primary_capacity?: string
  utilization_range?: {
    code: string
    name: string
    color: string
    type: string
    value: string
  }
  status_migrasi_data?: string
  category_utilization?: string
  cable_measurement_length?: string
}

export interface IReportMapBandwidthSegmentNonLambdaProperties extends IReportMapBandwidthSegmentProperties {}

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
