<template>
  <a-config-provider>
    <a-layout :style="{ height: '100vh' }">
      <a-layout-sider
        v-model:collapsed="fibermapStore.isSidebarCollapsed"
        :trigger="null"
        collapsible
        theme="light"
        :width="fibermapStore.sidebarExpandedSize"
        :collapsedWidth="fibermapStore.sidebarCollapsedSize"
        :style="{
          overflow: 'auto',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000
        }"
      >
        <!-- Toggle sidebar -->
        <a-button
          shape="circle"
          class="toggle-sidebar"
          :class="{
            'toggle-sidebar-collapsed': fibermapStore.isSidebarCollapsed,
            'toggle-sidebar-expanded': !fibermapStore.isSidebarCollapsed
          }"
          @click="toggleSidebar"
        >
          <left-outlined v-if="!fibermapStore.isSidebarCollapsed" />
          <right-outlined v-else />
        </a-button>

        <div
          v-show="!fibermapStore.isSidebarCollapsed"
          style="padding: 10px; display: flex; flex-direction: column; gap: 10px"
        >
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
                <eye-invisible-outlined
                  v-else
                  @click="fibermapStore.toggleLayerVisibility(layer)"
                />
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
                    @toggleLayerVisibility="fibermapStore.toggleLayerVisibility(child, subchild)"
                    collapsible="icon"
                  />
                </layer-group>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-content>
          <RouterView />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  SearchOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import { RouterView } from 'vue-router'
import { useFiberMapStore } from './stores/fibermap'
import LayerGroup from './components/LayerGroup.vue'
import { Empty } from 'ant-design-vue'
import { ref } from 'vue'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const fibermapStore = useFiberMapStore()
const isLoading = ref<boolean>(false)

const toggleSidebar = () => {
  fibermapStore.isSidebarCollapsed = !fibermapStore.isSidebarCollapsed
}
</script>

<style scoped>
.toggle-sidebar {
  position: fixed;
  left: 285px;
  z-index: 1001;
  top: 20px;
  /* transition: all 0.3s; */
}

.toggle-sidebar-expanded {
  left: 285px;
}

.toggle-sidebar-collapsed {
  left: 45px;
}
</style>
