import type L from 'leaflet'
import type { Ref } from 'vue'

declare global {
  interface Window {
    API_BASE_URL?: string
  }
}

const API_BASE_URL =
  window.API_BASE_URL || localStorage.getItem('API_BASE_URL') || 'http://localhost:8000/api'

export const getFibermapSitepoints = async (mapBound: Ref<L.LatLngBounds>) => {
  const ne = mapBound.value.getNorthEast()
  const sw = mapBound.value.getSouthWest()

  const response = await fetch(
    `${API_BASE_URL}/sitepoints/geojson?sw_lng=${sw.lng}&sw_lat=${sw.lat}&ne_lng=${ne.lng}&ne_lat=${ne.lat}`
  )

  return await response.json()
}

export const getFibermapAssets = async (mapBound: Ref<L.LatLngBounds>) => {
  const ne = mapBound.value.getNorthEast()
  const sw = mapBound.value.getSouthWest()

  const response = await fetch(
    `${API_BASE_URL}/sitepoints/geojson?sw_lng=${sw.lng}&sw_lat=${sw.lat}&ne_lng=${ne.lng}&ne_lat=${ne.lat}`
  )

  return await response.json()
}