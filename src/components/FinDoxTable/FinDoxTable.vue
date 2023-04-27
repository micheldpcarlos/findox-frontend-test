<script setup>
import FinDoxTableHeader from './FinDoxTableHeader.vue'
import { computed, ref, useSlots, watch } from 'vue'
import { orderBy } from 'lodash'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const props = defineProps({
  columns: Array,
  data: Array,
  height: String,
  filter: String,
  dataKey: String
})

const emit = defineEmits(['onSelectionChange', 'onRowClick'])

const slots = useSlots()

// sort logic
const sortKey = ref('')
const sortOrder = ref('')

const onTableSort = ({ key, order }) => {
  sortKey.value = key
  sortOrder.value = order
}

const columnFilters = ref({})

const onFilterChange = (data, columnKey) => {
  if (!data.length) {
    delete columnFilters.value[columnKey]
    return
  }
  columnFilters.value = { ...columnFilters.value, [columnKey]: data }
}

const dataFiltered = computed(() => {
  let dataArray = orderBy(props.data, [sortKey.value], [sortOrder.value])

  if (props.filter) {
    dataArray = dataArray.filter((item) => {
      return Object.values(item).join(',').toLowerCase().includes(props.filter?.toLowerCase())
    })
  }

  // loop selected filters
  for (const [key, filterValues] of Object.entries(columnFilters.value)) {
    dataArray = dataArray.filter((item) => filterValues.includes(item[key]))
  }

  return dataArray
})

const dataToShow = computed(() => {
  // get only keys that we need to use
  const dataKeys = props.columns.map((column) => column.key)

  // map the data into a new array with only the data we need on it.
  return dataFiltered.value.map((itemData) =>
    dataKeys.reduce((acc, key) => {
      return { ...acc, [key]: itemData[key] }
    }, {})
  )
})

const exportTableData = () => {
  return [...dataToShow.value]
}

const selectedItems = ref(new Set([]))
const allSelected = computed(() => selectedItems.value.size === dataFiltered.value.length)
const onSelectAll = (event) => {
  if (event.target.checked) {
    dataFiltered.value.forEach((deal) => {
      selectedItems.value.add(deal.id)
    })
  } else {
    selectedItems.value = new Set([])
  }

  emit('onSelectionChange', [...selectedItems.value])
}

const onSelectItem = (event, id) => {
  if (event.target.checked) {
    selectedItems.value.add(id)
  } else {
    selectedItems.value.delete(id)
  }

  emit('onSelectionChange', [...selectedItems.value])
}

watch(
  () => props.filter,
  () => {
    selectedItems.value = new Set([])
  }
)

// Expose the export function
defineExpose({
  exportTableData
})
</script>
<template>
  <div class="table-wrapper findox-table" :style="{ height }">
    <table>
      <colgroup>
        <col span="1" :style="{ width: '40px' }" />
        <col v-for="col in columns" span="1" :style="{ width: col.width ? col.width : '300px' }" />
      </colgroup>
      <thead>
        <tr>
          <th
            :style="{ width: '40px', padding: 'var(--default-table-padding)' }"
            class="selector-input"
          >
            <input
              type="checkbox"
              id="select-all"
              :checked="allSelected && dataToShow.length"
              @change="onSelectAll"
            />
          </th>
          <th v-for="column in columns">
            <FinDoxTableHeader
              :column="column"
              :data="data"
              :sort-key="sortKey"
              :sort-order="sortOrder"
              :column-filters="columnFilters[column.key]"
              @on-sort="onTableSort"
              @on-filter-change="onFilterChange($event, column.key)"
            />
          </th>
        </tr>
        <tr v-if="slots.subheader">
          <td :colspan="columns.length + 1" class="subheader-slot">
            <slot name="subheader" :itemsCount="dataToShow.length" />
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(rowData, index) in dataToShow"
          :class="{ gray: index % 2 === 1 }"
          @click="emit('onRowClick', dataFiltered[index])"
        >
          <td class="selector-input" @click.stop="">
            <input
              type="checkbox"
              :id="`select-${dataFiltered[index][dataKey]}`"
              :checked="selectedItems.has(dataFiltered[index][dataKey])"
              @change="onSelectItem($event, dataFiltered[index][dataKey])"
            />
          </td>
          <td v-for="cellData in rowData" width="row">
            <span :title="cellData">{{ cellData }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  overflow: auto;
}
table {
  border-collapse: separate;
  table-layout: fixed;
  width: 100%;
  thead {
    tr {
      border-bottom: 1px solid var(--table-border-color);
      position: sticky;
      top: 0;
      z-index: 1;
      th {
        border-right: 1px solid var(--table-border-color);
        background-color: var(--table-header-color);
        height: 32px;
        min-width: 300px;
      }
    }
  }

  tbody {
    tr {
      background-color: var(--table-line-white-item);
      &.gray {
        background-color: var(--table-line-gray-item);
      }
      td {
        padding: var(--default-table-padding);
        height: 32px;
        overflow: hidden;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.subheader-slot {
  padding: var(--default-table-padding);
  background-color: var(--table-subheader-bg);
  // needs to be after the table header
  position: sticky;
  top: 32px;
}
</style>
