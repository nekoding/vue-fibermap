<template>
  <a-select
    style="width: 100%"
    :allowClear="true"
    :showArrow="true"
    :filter-option="false"
    mode="multiple"
    :placeholder="placeholder"
    v-model:value="value"
    :options="options"
    :autoClearSearchValue="true"
    :disabled="isDisabled"
    @search="$emit('search', $event)"
    @deselect="$emit('deselect', $event)"
    @dropdownVisibleChange="$emit('dropdownVisibleChange', $event)"
    :maxTagCount="1"
  >
    <template v-if="isLoading" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const value = defineModel({ default: [] })

interface IOptions {
  label: any
  value: any
}

defineProps({
  placeholder: {
    type: String as PropType<string>,
    required: true
  },
  options: {
    type: Array as PropType<IOptions[]>,
    required: false
  },
  isLoading: {
    type: Boolean as PropType<boolean>,
    required: true
  },
  isDisabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  }
})

defineEmits(['search', 'dropdownVisibleChange', 'deselect'])
</script>
