<template>
  <div style="padding: 10px; display: flex; flex-direction: column; gap: 10px">
    <!-- Search layer -->
    <a-input placeholder="Search layer">
      <template #prefix>
        <search-outlined />
      </template>
    </a-input>

    <!-- Legend layer setting -->
    <a-button block>Legend Layer Setting</a-button>

    <!-- Layer Map -->
    <a-collapse :bordered="false" expandIconPosition="end" collapsible="icon">
      <a-collapse-panel v-for="layer in fibermapStore.layers" :key="layer.id">
        <template #header>
          <strong>{{ layer.name }}</strong>
        </template>
        <template #extra>
          <eye-outlined
            v-if="layer.isVisible"
            @click="fibermapStore.toggleLayerVisibility(layer)"
          />
          <eye-invisible-outlined v-else @click="fibermapStore.toggleLayerVisibility(layer)" />
        </template>
        <a-skeleton :loading="isLoading" active block />
        <div>
          <a-empty v-if="!isLoading && !layer.children?.length" :image="simpleImage" />
          <layer-group
            v-for="child in layer.children"
            :key="child.id"
            :header-title="child.name"
            :icon-src="child.icon"
            :show-arrow="Boolean(child?.children?.length) || false"
            :is-layer-visible="child.isVisible"
            @toggleLayerVisibility="fibermapStore.toggleLayerVisibility(child, layer)"
            collapsible="icon"
          >
            <layer-group
              v-for="subchild in child.children"
              :key="subchild.id"
              :header-title="subchild.name"
              :icon-src="subchild.icon"
              :is-layer-visible="subchild.isVisible"
              @toggleLayerVisibility="fibermapStore.toggleLayerVisibility(subchild, child)"
              collapsible="icon"
            />
          </layer-group>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFiberMapStore } from '../stores/fibermap'
import { EyeOutlined, EyeInvisibleOutlined, SearchOutlined } from '@ant-design/icons-vue'
import LayerGroup from '../components/LayerGroup.vue'
import { Empty } from 'ant-design-vue'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const isLoading = ref<boolean>(false)
const fibermapStore = useFiberMapStore()
</script>

<style scoped></style>
