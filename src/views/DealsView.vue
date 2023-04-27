<script setup>
import ColumnSelector from '../components/ColumnSelector.vue'
import FinDoxTable from '../components/FinDoxTable/FinDoxTable.vue'
import Button from '../components/common/Button.vue'
import { useFinDoxStore } from '../stores/findox'
import { ref, computed, h } from 'vue'
import xlsx from 'json-as-xlsx'
import { useRouter } from 'vue-router'

const finDoxStore = useFinDoxStore()

// Columns configuration needed to the table
const columns = ref([
  {
    title: 'Deal',
    key: 'dealName',
    width: '400px',
    enabled: true
  },
  { title: 'Issuer', key: 'issuer', enabled: true },
  { title: 'Industry', key: 'industry', enabled: true },
  { title: 'Agent', key: 'agent', enabled: true },
  { title: 'Source', key: 'source', enabled: true },

  { title: 'Boomberg Id', key: 'bloombergId', enabled: true },
  { title: 'ISIN', key: 'isin', enabled: true },
  { title: 'Custom Identifiers', key: 'customDealIdentifiers', enabled: true },
  { title: 'Custom Issuer Identifiers', key: 'customIssuerIdentifiers', enabled: true },
  { title: 'Status', key: 'status', enabled: true },
  { title: 'Total', key: 'total', enabled: true },
  { title: 'Last Posted', key: 'lastPosted', enabled: true },
  { title: 'Last Accessed', key: 'lastAccessed', enabled: true },
  { title: 'Analysts', key: 'analysts', enabled: true },
  { title: 'Documents Count', key: 'docCount', enabled: true },
  { title: 'Custom Field', key: 'customField', enabled: true }
])

const columnsToShow = computed(() => {
  return columns.value.filter((column) => column.enabled)
})

const filterString = ref('')
const dataTable = ref()
const isColumnsMenuActive = ref(false)

const exportTableData = () => {
  if (dataTable.value) {
    downloadExcel(dataTable.value.exportTableData())
  }
}

const onColumnsChange = (event) => {
  columns.value = JSON.parse(JSON.stringify(event))
}

const onSelectionChange = (e) => console.log(e)

const downloadExcel = (data) => {
  const xlsxData = [
    {
      sheet: 'Deals',
      columns: columnsToShow.value.map((column) => {
        return { label: column.title, value: column.key }
      }),
      content: data
    }
  ]
  const settings = {
    fileName: 'Deals'
  }

  xlsx(xlsxData, settings)
}

const router = useRouter()
const onRowClick = (data) => {
  router.push({ name: 'Documents', params: { id: data.id } })
}
</script>
<template>
  <div class="deals">
    <h1>Deals View</h1>
    <div class="actions">
      <input
        class="search-input"
        type="text"
        name="search"
        placeholder="Search"
        v-model="filterString"
      />
      <Button icon-name="fa-user-plus" disabled>Assign Analysts</Button>
      <VDropdown :distance="6" placement="bottom-end">
        <Button icon-name="fa-cog">Columns</Button>
        <template #popper="{ hide }">
          <ColumnSelector
            :columns="columns"
            @on-close="hide"
            @on-columns-change="onColumnsChange"
          />
        </template>
      </VDropdown>
      <Button icon-name="fa-file-excel" @click="exportTableData">Export</Button>
    </div>
    <FinDoxTable
      ref="dataTable"
      height="calc(100vh - 200px)"
      :columns="columnsToShow"
      :data="finDoxStore.deals"
      data-key="id"
      v-model:filter="filterString"
      @on-selection-change="onSelectionChange"
      @on-row-click="onRowClick"
    >
      <template #subheader="{ itemsCount }"
        >Showing <strong>{{ itemsCount }} deals</strong></template
      >
    </FinDoxTable>
  </div>
</template>

<style lang="scss" scoped>
.actions {
  padding: 2rem 0;
  display: flex;
  gap: 16px;
  justify-content: end;

  .search-input {
    margin-right: auto;
  }
}

:deep(.findox-table) {
  td:not(.selector-input) {
    cursor: pointer;
  }
}
</style>
