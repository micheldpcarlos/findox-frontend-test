<script setup>
import Button from '../components/common/Button.vue'
import { onMounted, ref, defineEmits } from 'vue'
const props = defineProps({
  columns: Array
})

const userColumns = ref([])
onMounted(() => {
  userColumns.value = JSON.parse(JSON.stringify(props.columns))
})

const emit = defineEmits(['onClose', 'onColumnsChange'])

const onSave = () => {
  emit('onColumnsChange', userColumns.value)
  emit('onClose')
}

const onCancel = () => {
  userColumns.value = userColumns.value
  emit('onClose')
}

const onReset = () => {
  userColumns.value = userColumns.value.map((column) => {
    return { ...column, enabled: true }
  })

  emit('onColumnsChange', userColumns.value)
  emit('onClose')
}
</script>

<template>
  <div class="column-selector">
    <div class="columns-list">
      <div class="checkbox-input" v-for="column in userColumns" :key="column.key">
        <input type="checkbox" :id="column.key" name="scales" v-model="column.enabled" />
        <label for="scales">{{ column.title }}</label>
      </div>
    </div>
    <div class="buttons">
      <Button type="primary" @click="onSave">Save</Button>
      <Button type="primary" @click="onCancel">Cancel</Button>
      <Button type="primary" @click="onReset">Reset</Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.column-selector {
  width: 300px;
  padding: 16px;

  .columns-list {
    margin: 16px 0;
    max-height: 400px;
    overflow: auto;
    .checkbox-input {
      margin: 12px 0;
      border-bottom: 1px solid var(--light-gray-color);
    }
  }

  .buttons {
    display: flex;
    gap: 8px;

    button {
      flex: 1;
    }
  }
}
</style>
