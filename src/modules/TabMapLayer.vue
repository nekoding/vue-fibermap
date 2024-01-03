<template>
  <div style="padding: 10px; display: flex; flex-direction: column; gap: 10px">
    <!-- Search layer -->
    <a-tree-select
      v-model:value="filterLayers"
      placeholder="Search layer"
      :allowClear="true"
      :maxTagCount="1"
      multiple
      show-search
      tree-checkable
      :tree-data="fibermapStore.treeLayerOptions"
      tree-node-filter-prop="label"
      :showArrow="true"
    >
      <template #suffixIcon>
        <search-outlined />
      </template>
    </a-tree-select>

    <!-- Legend layer setting -->
    <a-button block>Legend Layer Setting</a-button>

    <!-- Layer Map -->
    <a-collapse :bordered="false" expandIconPosition="end" collapsible="icon">
      <a-collapse-panel
        v-for="layer in fibermapStore.layers.filter((layer) => layer.isLayerVisible)"
        :key="layer.id"
      >
        <template #header>
          <strong>{{ layer.name }}</strong>
        </template>
        <template #extra>
          <eye-outlined v-if="layer.isVisible" @click="fibermapStore.toggleVisibility(layer)" />
          <eye-invisible-outlined v-else @click="fibermapStore.toggleVisibility(layer)" />
        </template>
        <a-skeleton :loading="isLoading" active block />
        <div>
          <a-empty v-if="!isLoading && !layer.children?.length" :image="simpleImage" />
          <layer-group
            v-for="child in layer.children?.filter((child) => child.isLayerVisible)"
            :key="child.id"
            :header-title="child.name"
            :icon-src="child.icon"
            :show-arrow="Boolean(child?.children?.length) || false"
            :is-layer-visible="child.isVisible"
            :is-layer-selected="fibermapStore.popupedLayer == child"
            @toggleLayerVisibility="fibermapStore.toggleVisibility(child, layer)"
            @clickLayer="child.onClick"
            collapsible="icon"
          >
            <layer-group
              v-for="subchild in child.children?.filter((subchild) => subchild.isLayerVisible)"
              :key="subchild.id"
              :header-title="subchild.name"
              :icon-src="subchild.icon"
              :is-layer-visible="subchild.isVisible"
              :is-layer-selected="fibermapStore.popupedLayer == subchild"
              @toggleLayerVisibility="fibermapStore.toggleVisibility(subchild, child)"
              @clickLayer="subchild.onClick"
              collapsible="icon"
            />
          </layer-group>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, watch } from 'vue'
import { useFiberMapStore } from '../stores/fibermap'
import { EyeOutlined, EyeInvisibleOutlined, SearchOutlined } from '@ant-design/icons-vue'
import LayerGroup from '../components/LayerGroup.vue'
import { Empty } from 'ant-design-vue'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const isLoading = ref<boolean>(false)
const fibermapStore = useFiberMapStore()
const filterLayers = ref<string[]>([])

watch(filterLayers, (value) => fibermapStore.toggleLayerVisibility(value))

defineProps({
  map: {
    type: Object as PropType<L.Map>,
    required: true
  }
})
</script>

<style scoped></style>
