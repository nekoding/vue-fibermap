<template>
  <div>
    <a-form
      layout="vertical"
      ref="formRef"
      :model="formState"
      autocomplete="off"
      @finish="onFinish"
    >
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
      <a-form-item>
        <a-button style="margin-right: 15px" @click="resetFields">Reset</a-button>
        <a-button type="primary" html-type="submit">Apply Filter</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAreaQuery, useCityQuery, useRegionQuery } from '@/hooks'
import { debounce } from 'lodash-es'
import { useReportMapStore } from '@/stores'
import SelectDropdown from '@/components/shared/SelectDropdown.vue'

interface FormState {
  regions: Array<number>
  areas: Array<number>
  cities: Array<number>
}

const store = useReportMapStore()
const formRef = ref<HTMLFormElement>()
const formState = reactive<FormState>({
  regions: [],
  areas: [],
  cities: []
})

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

const onSearchRegion = debounce((value: string) => {
  searchRegions(value)
}, 500)

const onSearchArea = debounce((value: string) => {
  searchAreas(value)
}, 500)

const onSearchCity = debounce((value: string) => {
  searchCities(value, {
    area_ids: formState.areas
  })
}, 500)

const onDeselectRegion = () => {
  formState.areas = []
  formState.cities = []
}

const onDeselectArea = () => {
  formState.cities = []
}

const onDeselectCity = () => {}

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
      region_ids: formState.regions,
      area_ids: formState.areas
    })
  }
}

const resetFibermapLayer = () => {
  resetRegion()
  resetArea()
  resetCity()
}

const resetFields = () => {
  formRef.value?.resetFields()
  resetFibermapLayer()
  store.resetLayers()
}

const onFinish = async (values: FormState) => {
  store.resetLayers()

  if (values.cities.length) {
    await store.getGeoJSONCities(values.cities)
    return
  }

  if (values.areas.length) {
    await store.getGeoJSONAreas(values.areas)
    return
  }

  await store.getGeoJSONRegions(values.regions)
}
</script>

<style scoped></style>
