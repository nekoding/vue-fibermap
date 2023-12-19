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
        <a-select
          style="width: 100%"
          :allowClear="true"
          :showArrow="true"
          :filter-option="false"
          mode="multiple"
          placeholder="Select project group"
          v-model:value="formState.projectGroups"
          :options="projectGroupOptions"
          :autoClearSearchValue="true"
          @search="onSearchProjectGroup"
          @dropdownVisibleChange="onDropdownVisibleProjectGroup"
        >
          <template v-if="isFetchingProjectGroup" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item
        label="Region"
        :name="['regions']"
        :rules="[{ required: false, message: 'Please select region' }]"
      >
        <a-select
          style="width: 100%"
          :allowClear="true"
          :showArrow="true"
          :filter-option="false"
          mode="multiple"
          placeholder="Select project group"
          v-model:value="formState.regions"
          :options="regionOptions"
          :autoClearSearchValue="true"
          @search="onSearchRegion"
          @deselect="onDeselectRegion"
          @dropdownVisibleChange="onDropdownVisibleRegion"
        >
          <template v-if="isFetchingRegion" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="Area" :name="['areas']">
        <a-select
          style="width: 100%"
          :allowClear="true"
          :showArrow="true"
          :filter-option="false"
          mode="multiple"
          placeholder="Select area"
          v-model:value="formState.areas"
          :options="areaOptions"
          :autoClearSearchValue="true"
          @search="onSearchArea"
          :disabled="formState.regions.length ? false : true"
          @deselect="onDeselectArea"
          @dropdownVisibleChange="onDropdownVisibleArea"
        >
          <template v-if="isFetchingArea" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="City" :name="['cities']">
        <a-select
          style="width: 100%"
          :allowClear="true"
          :showArrow="true"
          :filter-option="false"
          mode="multiple"
          placeholder="Select city"
          v-model:value="formState.cities"
          :options="cityOptions"
          :autoClearSearchValue="true"
          @search="onSearchCity"
          :disabled="formState.areas.length ? false : true"
          @deselect="onDeselectCity"
          @dropdownVisibleChange="onDropdownVisibleCity"
        >
          <template v-if="isFetchingCity" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="District" :name="['districts']">
        <a-select
          style="width: 100%"
          :allowClear="true"
          :showArrow="true"
          :filter-option="false"
          mode="multiple"
          placeholder="Select district"
          v-model:value="formState.districts"
          :options="districtOptions"
          :autoClearSearchValue="true"
          @search="onSearchDistrict"
          :disabled="formState.cities.length ? false : true"
          @dropdownVisibleChange="onDropdownVisibleDistrict"
        >
          <template v-if="isFetchingDistrict" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
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
} from '../hooks/hooks'
import { debounce } from 'lodash-es'
import { useFiberMapStore } from '../stores/fibermap'

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
    region_ids: formState.regions
  })
}, 500)

const onSearchDistrict = debounce((value: string) => {
  searchDistricts(value, {
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
