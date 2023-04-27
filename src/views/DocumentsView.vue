<script setup>
import ColumnSelector from '../components/ColumnSelector.vue'
import FinDoxTable from '../components/FinDoxTable/FinDoxTable.vue'
import Button from '../components/common/FindoxButton.vue'
import { useFinDoxStore } from '../stores/findox'
import { ref, computed, onMounted } from 'vue'
import xlsx from 'json-as-xlsx'
import { useRouter } from 'vue-router'

const finDoxStore = useFinDoxStore()

// Columns configuration needed to the table
const columns = ref([
  {
    title: 'Document Name',
    key: 'documentName',
    width: '400px',
    enabled: true
  },
  { title: 'Deal Id', key: 'dealId', enabled: true },
  { title: 'Posted', key: 'posted', enabled: true },
  { title: 'Last Accessed', key: 'lastAccessed', enabled: true },
  { title: 'File Path', key: 'filePath', width: '600px', enabled: true },
  { title: 'Note', key: 'note', enabled: true },
  { title: 'Tag', key: 'tag', enabled: true }
])

const columnsToShow = computed(() => {
  return columns.value.filter((column) => column.enabled)
})

const router = useRouter()
const numberFromParam = Number(router.currentRoute.value.params.id)

onMounted(() => {
  if (isNaN(numberFromParam)) {
    router.push('/deals')
  }
})

const documents = computed(() => {
  return finDoxStore.docs.filter((document) => document.dealId === numberFromParam)
})

const dealData = computed(() => {
  return finDoxStore.deals.find((deal) => deal.id === numberFromParam)
})

const filterString = ref('')
const dataTable = ref()

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
      sheet: 'Documents',
      columns: columnsToShow.value.map((column) => {
        return { label: column.title, value: column.key }
      }),
      content: data
    }
  ]
  const settings = {
    fileName: 'Documents'
  }

  xlsx(xlsxData, settings)
}

const onGoBack = () => {
  router.go(-1)
}
</script>
<template>
  <div class="documents">
    <h1>Documents View</h1>
    <span v-if="dealData" class="deal-info">
      <div>{{ dealData.dealName }}</div>
      <div class="sub">{{ dealData.issuer }}</div>
    </span>
    <Button type="link" icon-name="fa-arrow-left" @click="onGoBack" style="padding: 0"
      >Go back</Button
    >
    <div class="actions">
      <input
        class="search-input"
        type="text"
        name="search"
        placeholder="Search"
        v-model="filterString"
      />
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
      height="calc(100vh - 280px"
      :columns="columnsToShow"
      :data="documents"
      data-key="id"
      v-model:filter="filterString"
      @on-selection-change="onSelectionChange"
    >
      <template #subheader="{ itemsCount }"
        >Showing <strong>{{ itemsCount }} documents</strong></template
      >
    </FinDoxTable>
  </div>
</template>

<style lang="scss" scoped1>
.actions {
  padding: 2rem 0;
  display: flex;
  gap: 16px;
  justify-content: end;

  .search-input {
    margin-right: auto;
  }
}

.deal-info {
  font-weight: 800;
  .sub {
    font-size: 12px;
  }
}
</style>
