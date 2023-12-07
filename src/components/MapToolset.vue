<template>
  <div id="toolset">
    <div class="toolbar-panel">
      <toolbar-button
        :hasTooltip="true"
        :tooltipText="isToolsetOpen ? 'Close Map Toolset' : 'Open Map Toolset'"
        :action="toggleToolset"
        :buttonType="isToolsetOpen ? 'primary' : 'default'"
      >
        <template #icon>
          <DownOutlined v-if="!isToolsetOpen" />
          <UpOutlined v-else />
        </template>
      </toolbar-button>
    </div>

    <a-flex gap="3" :vertical="true" class="toolbar-panel" v-show="isToolsetOpen">
      <toolbar-button :hasTooltip="true" tooltipText="Zoom In" :action="zoomInAction">
        <template #icon>
          <PlusOutlined />
        </template>
      </toolbar-button>
      <toolbar-button :hasTooltip="true" tooltipText="Fit to Map" :action="fitMapAction">
        <template #icon>
          <ExpandOutlined />
        </template>
      </toolbar-button>
      <toolbar-button :hasTooltip="true" tooltipText="Zoom Out" :action="zoomOutAction">
        <template #icon>
          <MinusOutlined />
        </template>
      </toolbar-button>
    </a-flex>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  UpOutlined,
  DownOutlined,
  PlusOutlined,
  MinusOutlined,
  ExpandOutlined
} from '@ant-design/icons-vue'
import ToolbarButton from './shared/ToolbarButton.vue'
const isToolsetOpen = ref<boolean>(false)

const toggleToolset = () => {
  isToolsetOpen.value = !isToolsetOpen.value
}

onMounted(() => {})

defineProps({
  zoomInAction: {
    type: Function,
    default: () => {},
    required: false
  },
  fitMapAction: {
    type: Function,
    default: () => {},
    required: false
  },
  zoomOutAction: {
    type: Function,
    default: () => {},
    required: false
  }
})
</script>

<style scoped>
.toolbar-panel {
  position: relative;
  z-index: 999;
  margin-bottom: 5px;
}
</style>
