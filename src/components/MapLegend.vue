<template>
  <div>
    <a-collapse class="legend-panel" expandIconPosition="end">
      <a-collapse-panel key="1">
        <template #header>
          <strong>Legends</strong>
          <div>CAFEINS | Version 0.0.1</div>
        </template>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis aperiam eligendi ipsum vel
          et. Eius culpa blanditiis eaque eveniet, autem quaerat ipsum facilis suscipit numquam
          nostrum, dolores distinctio eligendi deleniti.
        </p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.legend-panel {
  position: relative;
  bottom: 20px;
  right: 0px;
  background: white;
  width: 400px;
  max-width: 400px;
  z-index: 999;
}

.ant-collapse-header-text {
  font-weight: bold !important;
}
</style>
