<template>
  <div>
    <a-form layout="vertical" :model="formState" autocomplete="off" @finish="onFinish">
      <a-form-item
        label="Project Group"
        :name="['projectGroups']"
        :rules="[{ required: true, message: 'Please select project groups' }]"
      >
        <a-select
          style="width: 100%"
          :allowClear="true"
          :showArrow="true"
          :filter-option="false"
          mode="multiple"
          placeholder="Select project group"
          v-model:value="formState.projectGroups"
          :not-found-content="isFetchingProjectGroup ? undefined : null"
          :options="projectGroupOptions"
          :autoClearSearchValue="true"
          @search="onSearchProjectGroup"
        >
          <template v-if="isFetchingProjectGroup" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item
        label="Region"
        :name="['regions']"
        :rules="[{ required: true, message: 'Please select region' }]"
      >
        <a-select
          style="width: 100%"
          :allowClear="true"
          :showArrow="true"
          :filter-option="false"
          mode="multiple"
          placeholder="Select project group"
          v-model:value="formState.regions"
          :not-found-content="isFetchingRegion ? undefined : null"
          :options="regionOptions"
          :autoClearSearchValue="true"
          @search="onSearchRegion"
          @deselect="onDeselectRegion"
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
          :not-found-content="isFetchingArea ? undefined : null"
          :options="areaOptions"
          :autoClearSearchValue="true"
          @search="onSearchArea"
          :disabled="formState.regions.length ? false : true"
          @deselect="onDeselectArea"
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
          :not-found-content="isFetchingCity ? undefined : null"
          :options="cityOptions"
          :autoClearSearchValue="true"
          @search="onSearchCity"
          :disabled="formState.areas.length ? false : true"
          @deselect="onDeselectCity"
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
          :not-found-content="isFetchingDistrict ? undefined : null"
          :options="districtOptions"
          :autoClearSearchValue="true"
          @search="onSearchDistrict"
          :disabled="formState.cities.length ? false : true"
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
import { reactive } from 'vue'
import {
  useProjectGroupQuery,
  useRegionQuery,
  useAreaQuery,
  useCityQuery,
  useDistrictQuery
} from '../hooks/hooks'
import { debounce } from 'lodash-es'

interface FormState {
  projectGroups: number[]
  regions: number[]
  areas: number[]
  cities: number[]
  districts: number[]
}

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
  searchProjectGroups
} = useProjectGroupQuery()
const { isFetching: isFetchingRegion, data: regionOptions, searchRegions } = useRegionQuery()
const { isFetching: isFetchingArea, data: areaOptions, searchAreas } = useAreaQuery()
const { isFetching: isFetchingCity, data: cityOptions, searchCities } = useCityQuery()
const {
  isFetching: isFetchingDistrict,
  data: districtOptions,
  searchDistricts
} = useDistrictQuery()

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

const resetFields = () => {
  formState.projectGroups = []
  formState.regions = []
  formState.areas = []
  formState.cities = []
  formState.districts = []
}

const onFinish = (values: any) => {
  console.log(values)
}
</script>

<style scoped></style>
