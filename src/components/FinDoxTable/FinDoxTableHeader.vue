<script setup>
import { computed, ref } from 'vue'
import Button from '../common/FindoxButton.vue'

const props = defineProps({
  data: Array,
  column: Object,
  sortKey: String,
  sortOrder: String,
  columnFilters: Array
})

const emit = defineEmits(['onSort', 'onFilterChange'])

const onSortBy = () => {
  let order = 'asc'
  if (props.column.key === props.sortKey) {
    order = props.sortOrder === 'asc' ? 'desc' : 'asc'
  }

  emit('onSort', { key: props.column.key, order: order })
}

const iconName = computed(() => {
  switch (props.sortKey) {
    case props.column.key:
      return `fa-solid ${props.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`
    default:
      return 'fa-solid fa-sort'
  }
})

const showFilter = ref(false)
const dataToFilter = ref(new Map([]))
const filterString = ref('')

const onShowFilter = () => {
  updateFilterEntries()
  showFilter.value = true
}

const updateFilterEntries = () => {
  dataToFilter.value.clear()
  props.data.forEach((data) => {
    const textData = data[props.column.key]
    const isSelected = textData && props.columnFilters && props.columnFilters.includes(textData)

    dataToFilter.value.set(textData, isSelected)
  })
}

const mapToRender = computed(() => {
  return new Map(
    [...dataToFilter.value].filter(([key]) =>
      key.toLowerCase().includes(filterString.value.toLowerCase())
    )
  )
})

const onFilterChange = (key, isEnabled) => {
  dataToFilter.value.set(key, isEnabled)
  const dataToEmit = [...dataToFilter.value]
    .filter((data) => data[1] === true)
    .map((data) => data[0])
  emit('onFilterChange', dataToEmit)
}

const onClearFilters = () => {
  dataToFilter.value.forEach((value, key) => {
    dataToFilter.value.set(key, false)
  })

  emit('onFilterChange', [])
}

const onHideFilter = () => {
  showFilter.value = false
}
</script>
<template>
  <div class="table-title" @click="onSortBy">
    <span class="title">
      {{ column.title }}
    </span>
    <span class="sorter" :class="{ hidden: column.key !== sortKey }"
      ><font-awesome-icon :icon="iconName"
    /></span>
    <VDropdown
      :distance="6"
      :skidding="12"
      placement="bottom-end"
      class="filter-dropdown"
      @show="onShowFilter"
      @apply-hide="onHideFilter"
    >
      <button class="filter-btn" :class="{ active: columnFilters?.length }" @click.stop="">
        <font-awesome-icon icon="fa-solid fa-filter" />
        <font-awesome-icon
          v-if="columnFilters?.length"
          icon="fa-solid fa-circle"
          class="ative-filter"
        />
      </button>
      <template #popper="{ hide }">
        <div class="filter-content" v-if="showFilter">
          <h3>{{ column.title }}</h3>
          <div class="buttons">
            <Button type="link" @click="emit('onSort', { key: column.key, order: 'asc' })"
              >Sort A to Z</Button
            >
            <Button type="link" @click="emit('onSort', { key: column.key, order: 'desc' })"
              >Sort Z to A</Button
            >
          </div>
          <input
            class="filter-input"
            type="text"
            name="filter"
            :placeholder="`Filter ${column.title}`"
            v-model="filterString"
          />
          <div class="item-list">
            <div v-for="[dataKey, enabled] in mapToRender" class="item" :key="dataKey">
              <input
                type="checkbox"
                :id="dataKey"
                :checked="enabled"
                @change="onFilterChange(dataKey, !enabled)"
              />
              <label for="scales">{{ dataKey }}</label>
            </div>
          </div>
          <div class="footer">
            <Button type="secondary" @click="onClearFilters">Clear Filters</Button>
            <Button @click="hide">Close</Button>
          </div>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<style lang="scss" scoped>
.table-title {
  padding: var(--default-table-padding);
  color: var(--table-header-text-color);
  cursor: pointer;
  display: flex;
  justify-content: center;

  .sorter {
    font-size: 12px;
    width: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    transition-duration: var(--default-transition-duration);

    &.hidden {
      opacity: 0;
      &:hover {
        opacity: 1;
      }
    }
  }

  .filter-dropdown {
    margin-left: auto;

    .filter-btn {
      cursor: pointer;
      font-size: 12px;
      opacity: 0;
      transition-duration: var(--default-transition-duration);

      &.active {
        opacity: 1 !important;

        .ative-filter {
          font-size: 5px;
        }
      }

      &:hover {
        opacity: 1;
      }
    }
  }

  &:hover {
    .sorter.hidden {
      opacity: 0.3;
    }
    .filter-btn {
      opacity: 0.3;
    }
  }

  .v-popper--shown {
    .filter-btn {
      opacity: 1 !important;
    }
  }
}

.filter-content {
  width: 300px;
  padding: 16px;

  h3 {
    text-align: center;
    font-weight: bolder;
    margin-bottom: 16px;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--light-gray-color);
  }

  .filter-input {
    width: 100%;
  }

  .item-list {
    max-height: 400px;
    overflow: auto;
    color: var(--primary-color);
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--light-gray-color);

    .item {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
  }
}
</style>
