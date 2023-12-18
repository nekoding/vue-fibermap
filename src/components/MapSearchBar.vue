<template>
  <div class="search-bar">
    <a-cascader
      style="width: 100%"
      placeholder="Search administrative area"
      v-model:value="administrativeArea"
      :options="administrativeArea"
    >
      <template #suffixIcon>
        <search-outlined :rotate="90" />
      </template>
    </a-cascader>
  </div>
</template>

<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { useProvinceQuery, API_BASE_URL, AUTH_TOKEN } from '../hooks/hooks'
import type { CascaderProps } from 'ant-design-vue'
import axios from 'axios'

const administrativeArea = ref<number[]>([])
</script>

<style scoped>
.search-bar {
  width: 300px;
  padding: 4px;
  background: #f0f0f3;
  border-radius: 6px;
  position: relative;
  z-index: 999;
  margin-bottom: 5px;
}
</style>
