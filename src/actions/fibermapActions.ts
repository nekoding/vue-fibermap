import type L from 'leaflet'
import type { Ref } from 'vue'

declare global {
  interface Window {
    API_BASE_URL?: string
  }
}

const API_BASE_URL =
  window.API_BASE_URL || localStorage.getItem('API_BASE_URL') || 'http://localhost:8000/api'

const AUTH_TOKEN = localStorage.getItem('app_token') || ''

export const getFibermapSitepoints = async (mapBound: Ref<L.LatLngBounds>) => {
  const ne = mapBound.value.getNorthEast()
  const sw = mapBound.value.getSouthWest()

  if (AUTH_TOKEN === '') {
    return {
      statusCode: 401,
      data: {
        message: 'App token is not set.'
      }
    }
  }

  const response = await fetch(
    `${API_BASE_URL}/sitepoints/geojson?sw_lng=${sw.lng}&sw_lat=${sw.lat}&ne_lng=${ne.lng}&ne_lat=${ne.lat}`,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        Accept: 'application/json'
      }
    }
  )

  return {
    statusCode: response.status,
    data: await response.json()
  }
}

export const getFibermapAssetGroups = async (mapBound: Ref<L.LatLngBounds>) => {
  const ne = mapBound.value.getNorthEast()
  const sw = mapBound.value.getSouthWest()

  if (AUTH_TOKEN === '') {
    return {
      statusCode: 401,
      data: {
        message: 'App token is not set.'
      }
    }
  }

  const response = await fetch(
    `${API_BASE_URL}/asset-groups/geojson?sw_lng=${sw.lng}&sw_lat=${sw.lat}&ne_lng=${ne.lng}&ne_lat=${ne.lat}`,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        Accept: 'application/json'
      }
    }
  )

  return {
    statusCode: response.status,
    data: await response.json()
  }
}

export const getFibermapRoutes = async (mapBound: Ref<L.LatLngBounds>) => {
  const ne = mapBound.value.getNorthEast()
  const sw = mapBound.value.getSouthWest()

  if (AUTH_TOKEN === '') {
    return {
      statusCode: 401,
      data: {
        message: 'App token is not set.'
      }
    }
  }

  const response = await fetch(
    `${API_BASE_URL}/routes/geojson?sw_lng=${sw.lng}&sw_lat=${sw.lat}&ne_lng=${ne.lng}&ne_lat=${ne.lat}`,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        Accept: 'application/json'
      }
    }
  )

  return {
    statusCode: response.status,
    data: await response.json()
  }
}

export const getFibermapCableGroups = async (mapBound: Ref<L.LatLngBounds>) => {}

export const getFibermapSegments = async (mapBound: Ref<L.LatLngBounds>) => {}
