<template>
  <div :class="className">
    <a-tooltip v-if="hasTooltip" :placement="tooltipPlacement">
      <template #title>
        <span>{{ tooltipText }}</span>
      </template>
      <a-button :type="buttonType" v-on:click="action">
        <template #icon>
          <slot name="icon" />
        </template>
        <slot />
      </a-button>
    </a-tooltip>

    <a-button v-else :type="buttonType" v-on:click="action">
      <template #icon>
        <slot name="icon" />
      </template>
      <slot />
    </a-button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: '',
    required: false
  },
  hasTooltip: {
    type: Boolean,
    default: false,
    required: false
  },
  tooltipPlacement: {
    type: String,
    default: 'right',
    required: false
  },
  tooltipText: {
    type: String,
    default: '',
    required: false
  },
  action: {
    type: Function,
    default: () => {},
    required: false
  },
  buttonType: {
    type: String,
    default: 'default',
    required: false
  }
})
</script>

<style scoped></style>
