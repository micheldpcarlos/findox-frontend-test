<script setup>
import ColumnSelector from '../components/ColumnSelector.vue';
import FinDoxTable from '../components/FinDoxTable/FinDoxTable.vue';
import Button from '../components/common/FindoxButton.vue';
import { useFinDoxStore } from '../stores/findox';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { docsColumnsConfig } from '../helpers/constants';
import { useExcelExporter } from '../composables/excelExporter';

const finDoxStore = useFinDoxStore();

// Columns configuration needed to the table
const columns = ref(docsColumnsConfig);

const columnsToShow = computed(() => {
  return columns.value.filter((column) => column.enabled);
});

const router = useRouter();
const numberFromParam = Number(router.currentRoute.value.params.id);

onMounted(() => {
  if (isNaN(numberFromParam)) {
    router.push('/deals');
  }
});

const documents = computed(() => {
  return finDoxStore.docs.filter((document) => document.dealId === numberFromParam);
});

const dealData = computed(() => {
  return finDoxStore.deals.find((deal) => deal.id === numberFromParam);
});

const filterString = ref('');

const onColumnsChange = (event) => {
  columns.value = JSON.parse(JSON.stringify(event));
};

const onSelectionChange = (e) => console.log(e);

const { dataTableRef, exportTableData } = useExcelExporter();

const onGoBack = () => {
  router.go(-1);
};
</script>
<template>
  <div class="documents">
    <h1>Documents View</h1>
    <span v-if="dealData" class="deal-info">
      <div>{{ dealData.dealName }}</div>
      <div class="sub">{{ dealData.issuer }}</div>
    </span>
    <Button type="link" icon-name="fa-arrow-left" style="padding: 0" @click="onGoBack"
      >Go back</Button
    >
    <div class="actions">
      <input
        v-model="filterString"
        class="search-input"
        type="text"
        name="search"
        placeholder="Search"
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
      <Button icon-name="fa-file-excel" @click="exportTableData(columnsToShow)">Export</Button>
    </div>
    <FinDoxTable
      ref="dataTableRef"
      v-model:filter="filterString"
      height="calc(100vh - 280px"
      :columns="columnsToShow"
      :data="documents"
      data-key="id"
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
  flex-wrap: wrap;
  justify-content: start;
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
