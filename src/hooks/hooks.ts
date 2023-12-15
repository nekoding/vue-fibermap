import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { reactive, ref, watch } from 'vue'
import type { Ref } from 'vue'

declare global {
  interface Window {
    API_BASE_URL?: string
  }
}

export const API_BASE_URL =
  window.API_BASE_URL || localStorage.getItem('API_BASE_URL') || 'http://localhost:8000/api'

export const AUTH_TOKEN = localStorage.getItem('app_token') || ''

export const useSitepointQuery = () => {
  const boundaries = reactive({
    sw_lng: 0,
    sw_lat: 0,
    ne_lng: 0,
    ne_lat: 0
  })
  const regionIds = ref<number[]>([])
  const cityIds = ref<number[]>([])
  const districtIds = ref<number[]>([])
  const areaIds = ref<number[]>([])
  const projectGroupIds = ref<number[]>([])

  // fetch api
  const { isLoading, isError, isFetching, data, error, refetch } = useQuery({
    queryKey: ['sitepoints'],
    queryFn: async ({ signal }) => {
      const projectGroups = projectGroupIds.value.join(',')
      const regions = regionIds.value.join(',')
      const areas = areaIds.value.join(',')
      const cities = cityIds.value.join(',')
      const districts = districtIds.value.join(',')
      const res = await axios.get<ApiResponse>(
        `${API_BASE_URL}/sitepoints/geojson?project_group_ids=${projectGroups}&region_ids=${regions}&area_ids=${areas}&city_ids=${cities}&district_ids=${districts}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: 'application/json'
          }
        }
      )

      return (res.data.result?.data ?? []) as SitePoint[]
    },
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const searchSitepoints = (options: {
    boundaries?: {
      sw_lng: number
      sw_lat: number
      ne_lng: number
      ne_lat: number
    }
    region_ids?: number[]
    city_ids?: number[]
    district_ids?: number[]
    area_ids?: number[]
    project_group_ids?: number[]
  }) => {
    boundaries.sw_lng = options.boundaries?.sw_lng ?? 0
    boundaries.sw_lat = options.boundaries?.sw_lat ?? 0
    boundaries.ne_lng = options.boundaries?.ne_lng ?? 0
    boundaries.ne_lat = options.boundaries?.ne_lat ?? 0
    regionIds.value = options.region_ids ?? []
    cityIds.value = options.city_ids ?? []
    districtIds.value = options.district_ids ?? []
    areaIds.value = options.area_ids ?? []
    projectGroupIds.value = options.project_group_ids ?? []

    refetch()
  }

  return {
    isLoading,
    isError,
    isFetching,
    data,
    error,
    searchSitepoints
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

export const useCableGroupQuery = () => {}

export const useSegmentQuery = () => {}

export const useProjectGroupQuery = () => {
  const search = ref<string>()
  const { isLoading, isFetching, isError, data, error, refetch } = useQuery({
    retry: false,
    queryKey: ['projectGroups'],
    queryFn: async ({ signal }) => {
      const res = await axios.get<ApiResponse>(
        `${API_BASE_URL}/project-groups?name=${search.value}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: 'application/json'
          }
        }
      )

      return (
        res.data.result?.data?.map((projectGroup: any) => ({
          label: projectGroup.name,
          value: projectGroup.id
        })) ?? []
      )
    },
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const searchProjectGroups = (value: string): void => {
    search.value = value
    refetch()
  }

  return {
    isLoading,
    isFetching,
    isError,
    data,
    error,
    searchProjectGroups
  }
}

export const useRegionQuery = () => {
  const search = ref<string>()
  const { isLoading, isFetching, isError, data, error, refetch } = useQuery({
    retry: false,
    queryKey: ['regions'],
    queryFn: async ({ signal }) => {
      const res = await axios.get<ApiResponse>(`${API_BASE_URL}/regions?label=${search.value}`, {
        signal,
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          Accept: 'application/json'
        }
      })

      return (
        res.data.result?.data?.map((region: any) => ({
          value: region.id,
          label: region.label
        })) ?? []
      )
    },
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const searchRegions = (value: string): void => {
    search.value = value
    refetch()
  }

  return {
    isLoading,
    isFetching,
    isError,
    data,
    error,
    searchRegions
  }
}

export const useAreaQuery = () => {
  const search = ref<string>()
  const regions = ref<number[]>()

  const { isLoading, isFetching, isError, data, error, refetch } = useQuery({
    retry: false,
    queryKey: ['areas'],
    queryFn: async ({ signal }) => {
      const res = await axios.get<ApiResponse>(
        `${API_BASE_URL}/areas?label=${search.value}&region_ids=${regions.value?.join(',')}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: 'application/json'
          }
        }
      )

      return (
        res.data.result?.data?.map((area: any) => ({
          value: area.id,
          label: area.label
        })) ?? []
      )
    },
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const searchAreas = (
    value: string,
    options?: {
      region_ids?: number[]
    }
  ): void => {
    search.value = value
    regions.value = options?.region_ids ?? []

    refetch()
  }

  return {
    isLoading,
    isFetching,
    isError,
    data,
    error,
    searchAreas
  }
}

export const useCityQuery = () => {
  const search = ref<string>()
  const regions = ref<number[]>()

  const { isLoading, isFetching, isError, data, error, refetch } = useQuery({
    retry: false,
    queryKey: ['cities'],
    queryFn: async ({ signal }) => {
      const res = await axios.get<ApiResponse>(
        `${API_BASE_URL}/cities?name=${search.value}&region_ids=${regions.value?.join(',')}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: 'application/json'
          }
        }
      )

      return (
        res.data.result?.data?.map((city: any) => ({
          value: city.id,
          label: city.name
        })) ?? []
      )
    },
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const searchCities = (
    value: string,
    options?: {
      region_ids?: number[]
    }
  ): void => {
    search.value = value
    regions.value = options?.region_ids ?? []

    refetch()
  }

  return {
    isLoading,
    isFetching,
    isError,
    data,
    error,
    searchCities
  }
}

export const useDistrictQuery = () => {
  const search = ref<string>()
  const cities = ref<number[]>()

  const { isLoading, isFetching, isError, data, error, refetch } = useQuery({
    retry: false,
    queryKey: ['districts'],
    queryFn: async ({ signal }) => {
      const res = await axios.get<ApiResponse>(
        `${API_BASE_URL}/districts?name=${search.value}&city_ids=${cities.value?.join(',')}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: 'application/json'
          }
        }
      )

      return (
        res.data.result?.data?.map((district: any) => ({
          value: district.id,
          label: district.name
        })) ?? []
      )
    },
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const searchDistricts = (
    value: string,
    options?: {
      city_ids?: number[]
    }
  ): void => {
    search.value = value
    cities.value = options?.city_ids ?? []

    refetch()
  }

  return {
    isLoading,
    isFetching,
    isError,
    data,
    error,
    searchDistricts
  }
}
