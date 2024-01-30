<template>
  <div class="tab-map-layer">
    <!-- Layer Map -->
    <a-collapse :bordered="true" expandIconPosition="end" collapsible="icon">
      <a-collapse-panel
        v-for="layer in store.layers.filter((layer) => layer.isLayerVisible)"
        :key="layer.id"
      >
        <template #header>
          <strong>{{ layer.name }}</strong>
        </template>
        <template #extra>
          <eye-outlined v-if="layer.isVisible" @click="store.toggleVisibility(layer)" />
          <eye-invisible-outlined v-else @click="store.toggleVisibility(layer)" />
        </template>
        <a-skeleton v-if="store.isDataFetching" :loading="store.isDataFetching" active block />

        <div v-else>
          <a-empty v-if="(layer.children?.length || 0) < 1" :image="simpleImage" />

          <layer-group
            v-else
            v-for="children in layer.children?.filter((child) => child.isLayerVisible)"
            :key="`child-${children.id}`"
            :header-title="children.name"
            :show-arrow="Boolean(layer?.children?.length) || false"
            :is-layer-visible="children.isVisible"
            :is-layer-selected="store.popupedLayer == children"
            @toggleLayerVisibility="store.toggleVisibility(children, layer)"
            @clickLayer="children.onClick"
            collapsible="icon"
          >
            <layer-group
              v-for="subchildren in children.children?.filter(
                (subchild) => subchild.isLayerVisible
              )"
              :key="`subchild-${subchildren.id}`"
              :header-title="subchildren.name"
              :show-arrow="Boolean(subchildren?.children?.length) || false"
              :is-layer-visible="subchildren.isVisible"
              :is-layer-selected="store.popupedLayer == subchildren"
              @toggleLayerVisibility="store.toggleVisibility(subchildren, children)"
              @clickLayer="subchildren.onClick"
              collapsible="icon"
            >
              <layer-group
                v-for="grandchildren in subchildren.children?.filter(
                  (grandchild) => grandchild.isLayerVisible
                )"
                :key="`grandchild-${grandchildren.id}`"
                :header-title="grandchildren.name"
                :show-arrow="Boolean(grandchildren?.children?.length) || false"
                :is-layer-visible="grandchildren.isVisible"
                :is-layer-selected="store.popupedLayer == grandchildren"
                @toggleLayerVisibility="store.toggleVisibility(grandchildren, subchildren)"
                @clickLayer="grandchildren.onClick"
                collapsible="icon"
              />
            </layer-group>
          </layer-group>
        </div>
      </a-collapse-panel>
    </a-collapse>

    <a-button type="primary" block @click="store.generateFiberMapReport">Generate Report</a-button>
  </div>
</template>

<script setup lang="ts">
import { useReportMapStore } from '@/stores'
import LayerGroup from '@/components/LayerGroup.vue'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'
import { Empty } from 'ant-design-vue'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

const store = useReportMapStore()
</script>

<style scoped>
.tab-map-layer {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
