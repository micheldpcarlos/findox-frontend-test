import { ref } from 'vue';
import xlsx from 'json-as-xlsx';

export function useExcelExporter() {
  const dataTableRef = ref();
  const exportTableData = (columnsRef) => {
    if (dataTableRef.value) {
      downloadExcel(
        dataTableRef.value.exportTableData(),
        columnsRef.map((column) => {
          return { label: column.title, value: column.key };
        })
      );
    }
  };

  const downloadExcel = (data, columns) => {
    const xlsxData = [
      {
        sheet: 'Documents',
        columns: columns,
        content: data
      }
    ];
    const settings = {
      fileName: 'Documents'
    };

    xlsx(xlsxData, settings);
  };

  return { dataTableRef, exportTableData };
}
