import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { watch } from 'vue'
import type { Ref } from 'vue'

declare global {
  interface Window {
    API_BASE_URL?: string
  }
}

const API_BASE_URL =
  window.API_BASE_URL || localStorage.getItem('API_BASE_URL') || 'http://localhost:8000/api'

const AUTH_TOKEN = localStorage.getItem('app_token') || ''

export const useSitepointQuery = (mapBound: Ref<L.LatLngBounds>) => {
  let ne = mapBound.value.getNorthEast()
  let sw = mapBound.value.getSouthWest()

  // fetch api
  const { isLoading, isError, isFetching, data, error } = useQuery({
    queryKey: ['sitepoints', mapBound],
    queryFn: ({ signal }) =>
      axios.get(
        `${API_BASE_URL}/sitepoints/geojson?sw_lng=${sw.lng}&sw_lat=${sw.lat}&ne_lng=${ne.lng}&ne_lat=${ne.lat}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: 'application/json'
          }
        }
      ),
    retry: false
  })

  // watchers
  watch(mapBound, (newData) => {
    ne = newData.getNorthEast()
    sw = newData.getSouthWest()
  })

  return {
    isLoading,
    isError,
    isFetching,
    data,
    error
  }
}

export const useAssetGroupQuery = (mapBound: Ref<L.LatLngBounds>) => {
  let ne = mapBound.value.getNorthEast()
  let sw = mapBound.value.getSouthWest()

  // fetch api
  const { isLoading, isError, isFetching, data, error } = useQuery({
    queryKey: ['assetGroups', mapBound],
    queryFn: ({ signal }) =>
      axios.get(
        `${API_BASE_URL}/asset-groups/geojson?sw_lng=${sw.lng}&sw_lat=${sw.lat}&ne_lng=${ne.lng}&ne_lat=${ne.lat}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: 'application/json'
          }
        }
      ),
    retry: false
  })

  // watchers
  watch(mapBound, (newData) => {
    ne = newData.getNorthEast()
    sw = newData.getSouthWest()
  })

  return {
    isLoading,
    isError,
    isFetching,
    data,
    error
  }
}

export const useRouteQuery = (mapBound: Ref<L.LatLngBounds>) => {
  let ne = mapBound.value.getNorthEast()
  let sw = mapBound.value.getSouthWest()

  // fetch api
  const { isLoading, isError, isFetching, data, error } = useQuery({
    queryKey: ['routes', mapBound],
    queryFn: ({ signal }) =>
      axios.get(
        `${API_BASE_URL}/routes/geojson?sw_lng=${sw.lng}&sw_lat=${sw.lat}&ne_lng=${ne.lng}&ne_lat=${ne.lat}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: 'application/json'
          }
        }
      ),
    retry: false
  })

  // watchers
  watch(mapBound, (newData) => {
    ne = newData.getNorthEast()
    sw = newData.getSouthWest()
  })

  return {
    isLoading,
    isError,
    isFetching,
    data,
    error
  }
}

export const useCableGroupQuery = (mapBound: Ref<L.LatLngBounds>) => {}

export const useSegmentQuery = (mapBound: Ref<L.LatLngBounds>) => {}
