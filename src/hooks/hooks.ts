import {
  getFibermapAssetGroups,
  getFibermapRoutes,
  getFibermapSitepoints
} from '@/actions/fibermapActions'
import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'

export const useSitepointQuery = (mapBound: Ref<L.LatLngBounds>) => {
  // fetch api
  const { isLoading, isError, isFetching, data, error } = useQuery({
    queryKey: ['sitepoints', mapBound],
    queryFn: () => getFibermapSitepoints(mapBound)
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
  // fetch api
  const { isLoading, isError, isFetching, data, error } = useQuery({
    queryKey: ['assetGroups', mapBound],
    queryFn: () => getFibermapAssetGroups(mapBound)
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
  // fetch api
  const { isLoading, isError, isFetching, data, error } = useQuery({
    queryKey: ['routes', mapBound],
    queryFn: () => getFibermapRoutes(mapBound)
  })

  return {
    isLoading,
    isError,
    isFetching,
    data,
    error
  }
}
