<script setup>
import ColumnSelector from '../components/ColumnSelector.vue';
import FinDoxTable from '../components/FinDoxTable/FinDoxTable.vue';
import Button from '../components/common/FindoxButton.vue';
import { useFinDoxStore } from '../stores/findox';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { dealsColumnsConfig } from '../helpers/constants';
import { useExcelExporter } from '../composables/excelExporter';

const finDoxStore = useFinDoxStore();

// Columns configuration needed to the table
const columns = ref(dealsColumnsConfig);

const columnsToShow = computed(() => {
  return columns.value.filter((column) => column.enabled);
});

const filterString = ref('');

const onColumnsChange = (event) => {
  columns.value = JSON.parse(JSON.stringify(event));
};

const onSelectionChange = (e) => console.log(e);

const { dataTableRef, exportTableData } = useExcelExporter();

const router = useRouter();
const onRowClick = (data) => {
  router.push({ name: 'Documents', params: { id: data.id } });
};
</script>
<template>
  <div class="deals">
    <h1>Deals View</h1>
    <div class="actions">
      <input
        v-model="filterString"
        class="search-input"
        type="text"
        name="search"
        placeholder="Search"
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
      <Button icon-name="fa-file-excel" @click="exportTableData(columnsToShow)">Export</Button>
    </div>
    <FinDoxTable
      ref="dataTableRef"
      v-model:filter="filterString"
      height="calc(100vh - 200px)"
      :columns="columnsToShow"
      :data="finDoxStore.deals"
      data-key="id"
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
