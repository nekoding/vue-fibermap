import type L from 'leaflet'
import type { Ref } from 'vue'

declare global {
  interface Window {
    BASE_URL?: string
  }
}

const BASE_URL = window.BASE_URL || 'http://localhost:3000/api'

const getSitePoints = async (mapBound: Ref<L.LatLngBounds>) => {
  const minLat = mapBound.value.getSouth()
  const maxLat = mapBound.value.getNorth()
  const minLng = mapBound.value.getWest()
  const maxLng = mapBound.value.getEast()

  const response = await fetch(
    `${BASE_URL}/sitepoints/geojson?min_lat=${minLat}&max_lat=${maxLat}&min_lng=${minLng}&max_lng=${maxLng}`
  )
  return await response.json()
}

const fetchAssets = async () => {}

const fetchRoutes = async () => {}

const fetchCables = async () => {}

const fetchSegments = async () => {}

export { getSitePoints }
