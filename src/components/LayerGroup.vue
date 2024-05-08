<template>
  <div>
    <a-collapse
      :bordered="bordered"
      :expandIconPosition="expandIconPosition"
      :collapsible="collapsible"
      :style="isLayerSelected && 'background: rgb(20, 118, 255, 0.1)'"
    >
      <a-collapse-panel :showArrow="showArrow" style="margin-bottom: 10px" :key="headerTitle">
        <template #header>
          <span @click="$emit('clickLayer')" style="cursor: pointer">
            <i v-show="iconSrc.length > 1">
              <a-image :width="24" :preview="false" :src="iconSrc" />
            </i>
            {{ headerTitle }}
          </span>
        </template>

        <template #extra>
          <eye-outlined v-if="isLayerVisible" @click="$emit('toggleLayerVisibility')" />
          <eye-invisible-outlined v-else @click="$emit('toggleLayerVisibility')" />
        </template>

        <slot />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'

defineProps({
  headerTitle: {
    type: String,
    required: true
  },
  showArrow: {
    type: Boolean,
    default: false,
    required: false
  },
  collapsible: {
    type: String,
    default: 'header',
    required: false
  },
  iconSrc: {
    type: String,
    default: '',
    required: false
  },
  bordered: {
    type: Boolean,
    default: true,
    required: false
  },
  expandIconPosition: {
    type: String,
    default: 'start',
    required: false
  },
  isLayerVisible: {
    type: Boolean,
    default: true,
    required: false
  },
  isLayerSelected: {
    type: Boolean,
    default: false,
    required: false
  }
})

defineEmits(['toggleLayerVisibility', 'clickLayer'])
</script>

<style scoped></style>
