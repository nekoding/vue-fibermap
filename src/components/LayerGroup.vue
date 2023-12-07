<template>
  <div>
    <a-collapse
      :bordered="bordered"
      :expandIconPosition="expandIconPosition"
      :collapsible="collapsible"
    >
      <a-collapse-panel :showArrow="showArrow" style="margin-bottom: 10px" :key="headerTitle">
        <template #header>
          <span>
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
  }
})

defineEmits(['toggleLayerVisibility'])
</script>

<style scoped></style>
