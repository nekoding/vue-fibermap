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

          <!-- Layer Group -->
          <a-collapse :bordered="false" expandIconPosition="end" collapsible="icon">
            <a-collapse-panel v-for="(layer, index) in fibermapStore.data" :key="index">
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

              <layer-group
                v-for="item in layer.children"
                :key="item.name"
                :header-title="item.name"
                :icon-src="item.icon"
                :show-arrow="Boolean(item?.children?.length) || false"
                :is-layer-visible="item.isVisible"
                @toggleLayerVisibility="fibermapStore.toggleLayerVisibility(item, layer)"
                collapsible="icon"
              >
                <layer-group
                  v-for="child in item.children"
                  :key="child.name"
                  :header-title="child.name"
                  :icon-src="child.icon"
                  :is-layer-visible="child.isVisible"
                  @toggleLayerVisibility="fibermapStore.toggleLayerVisibility(child, item)"
                  collapsible="icon"
                />
              </layer-group>
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

const fibermapStore = useFiberMapStore()

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
