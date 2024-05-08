<template>
  <div>
    <a-form
      layout="vertical"
      ref="formRef"
      :model="formState"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item label="Project Group" :name="['projectGroups']">
        <select-dropdown
          placeholder="Select project group"
          v-model="formState.projectGroups"
          :options="projectGroupOptions"
          :isLoading="isFetchingProjectGroup"
          @search="onSearchProjectGroup"
          @dropdownVisibleChange="onDropdownVisibleProjectGroup"
        />
      </a-form-item>
      <a-form-item
        label="Region"
        :name="['regions']"
        :rules="[{ required: true, message: 'Please select region' }]"
      >
        <select-dropdown
          placeholder="Select region"
          v-model="formState.regions"
          :options="regionOptions"
          :isLoading="isFetchingRegion"
          @search="onSearchRegion"
          @deselect="onDeselectRegion"
          @dropdownVisibleChange="onDropdownVisibleRegion"
        />
      </a-form-item>
      <a-form-item label="Area" :name="['areas']">
        <select-dropdown
          placeholder="Select area"
          v-model="formState.areas"
          :options="areaOptions"
          :isLoading="isFetchingArea"
          :isDisabled="formState.regions.length ? false : true"
          @search="onSearchArea"
          @deselect="onDeselectArea"
          @dropdownVisibleChange="onDropdownVisibleArea"
        />
      </a-form-item>
      <a-form-item label="City" :name="['cities']">
        <select-dropdown
          placeholder="Select city"
          v-model="formState.cities"
          :options="cityOptions"
          :isLoading="isFetchingCity"
          :isDisabled="formState.areas.length ? false : true"
          @search="onSearchCity"
          @deselect="onDeselectCity"
          @dropdownVisibleChange="onDropdownVisibleCity"
        />
      </a-form-item>
      <a-form-item label="District" :name="['districts']">
        <select-dropdown
          placeholder="Select district"
          v-model="formState.districts"
          :options="districtOptions"
          :isLoading="isFetchingDistrict"
          :isDisabled="formState.cities.length ? false : true"
          @search="onSearchDistrict"
          @dropdownVisibleChange="onDropdownVisibleDistrict"
        />
      </a-form-item>
      <a-form-item>
        <a-button style="margin-right: 15px" @click="resetFields">Reset</a-button>
        <a-button type="primary" html-type="submit">Apply Filter</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import {
  useProjectGroupQuery,
  useRegionQuery,
  useAreaQuery,
  useCityQuery,
  useDistrictQuery,
  useSitepointQuery,
  useAssetQuery,
  useRouteQuery,
  useCableQuery,
  useSegmentQuery
} from '../../hooks/hooks'
import { debounce } from 'lodash-es'
import { useFiberMapStore } from '../../stores/fibermap'
import SelectDropdown from '@/components/shared/SelectDropdown.vue'

interface FormState {
  projectGroups: number[]
  regions: number[]
  areas: number[]
  cities: number[]
  districts: number[]
}

const fibermapStore = useFiberMapStore()
const formRef = ref<HTMLFormElement>()
const formState = reactive<FormState>({
  projectGroups: [],
  regions: [],
  areas: [],
  cities: [],
  districts: []
})

const {
  isFetching: isFetchingProjectGroup,
  data: projectGroupOptions,
  searchProjectGroups,
  reset: resetProjectGroup
} = useProjectGroupQuery()
const {
  isFetching: isFetchingRegion,
  data: regionOptions,
  searchRegions,
  reset: resetRegion
} = useRegionQuery()
const {
  isFetching: isFetchingArea,
  data: areaOptions,
  searchAreas,
  reset: resetArea
} = useAreaQuery()
const {
  isFetching: isFetchingCity,
  data: cityOptions,
  searchCities,
  reset: resetCity
} = useCityQuery()
const {
  isFetching: isFetchingDistrict,
  data: districtOptions,
  searchDistricts,
  reset: resetDistrict
} = useDistrictQuery()
const { data: sitepointData, searchSitepoints, reset: resetSitepoint } = useSitepointQuery()
const { data: assetData, searchAssets, reset: resetAsset } = useAssetQuery()
const { data: routeData, searchRoutes, reset: resetRoute } = useRouteQuery()
const { data: cableData, searchCables, reset: resetCable } = useCableQuery()
const { data: segmentData, searchSegments, reset: resetSegment } = useSegmentQuery()

const onSearchProjectGroup = debounce((value: string) => {
  searchProjectGroups(value)
}, 500)

const onSearchRegion = debounce((value: string) => {
  searchRegions(value)
}, 500)

const onSearchArea = debounce((value: string) => {
  searchAreas(value, {
    region_ids: formState.regions
  })
}, 500)

const onSearchCity = debounce((value: string) => {
  searchCities(value, {
    region_ids: formState.regions,
    area_ids: formState.areas
  })
}, 500)

const onSearchDistrict = debounce((value: string) => {
  searchDistricts(value, {
    region_ids: formState.regions,
    area_ids: formState.areas,
    city_ids: formState.cities
  })
}, 500)

const onDeselectRegion = () => {
  formState.areas = []
  formState.cities = []
  formState.districts = []
}

const onDeselectArea = () => {
  formState.cities = []
  formState.districts = []
}

const onDeselectCity = () => {
  formState.districts = []
}

const onDropdownVisibleProjectGroup = (open: boolean) => {
  if (open) {
    searchProjectGroups('')
  }
}

const onDropdownVisibleRegion = (open: boolean) => {
  if (open) {
    searchRegions('')
  }
}

const onDropdownVisibleArea = (open: boolean) => {
  if (open) {
    searchAreas('', {
      region_ids: formState.regions
    })
  }
}

const onDropdownVisibleCity = (open: boolean) => {
  if (open) {
    searchCities('', {
      region_ids: formState.regions
    })
  }
}

const onDropdownVisibleDistrict = (open: boolean) => {
  if (open) {
    searchDistricts('', {
      city_ids: formState.cities
    })
  }
}

const resetFibermapLayer = () => {
  fibermapStore.setSitePointLayer([])
  fibermapStore.setAssetLayer([])
  fibermapStore.setRouteLayer([])
  fibermapStore.setCableLayer([])
  fibermapStore.setSegmentLayer([])

  resetSitepoint()
  resetAsset()
  resetRoute()
  resetCable()
  resetSegment()

  resetProjectGroup()
  resetRegion()
  resetArea()
  resetCity()
  resetDistrict()
}

const resetFields = () => {
  formRef.value?.resetFields()
  resetFibermapLayer()
}

const onFinish = (values: FormState) => {
  fibermapStore.isDataFetching = true

  searchSitepoints({
    project_group_ids: values.projectGroups,
    region_ids: values.regions,
    area_ids: values.areas,
    city_ids: values.cities,
    district_ids: values.districts
  })

  searchAssets({
    project_group_ids: values.projectGroups,
    region_ids: values.regions,
    area_ids: values.areas,
    city_ids: values.cities,
    district_ids: values.districts
  })

  searchRoutes({
    project_group_ids: values.projectGroups,
    region_ids: values.regions,
    area_ids: values.areas,
    city_ids: values.cities,
    district_ids: values.districts
  })

  searchCables({
    project_group_ids: values.projectGroups,
    region_ids: values.regions,
    area_ids: values.areas,
    city_ids: values.cities,
    district_ids: values.districts
  })

  searchSegments({
    project_group_ids: values.projectGroups,
    region_ids: values.regions,
    area_ids: values.areas,
    city_ids: values.cities,
    district_ids: values.districts
  })

  setTimeout(() => {
    fibermapStore.isDataFetching = false
  }, 1000)
}

watch(
  [sitepointData, assetData, routeData, cableData, segmentData],
  ([newSitepointData, newAssetData, newRouteData, newCableData, newSegmentData]) => {
    fibermapStore.setSitePointLayer(newSitepointData ?? [])
    fibermapStore.setAssetLayer(newAssetData ?? [])
    fibermapStore.setRouteLayer(newRouteData ?? [])
    fibermapStore.setCableLayer(newCableData ?? [])
    fibermapStore.setSegmentLayer(newSegmentData ?? [])
  }
)
</script>

<style scoped></style>
