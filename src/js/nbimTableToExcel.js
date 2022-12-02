/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
export default function nbimTableToExcel() {
    const downloadFile = (table) => {
        const tableHTML = document.getElementsByClassName('nbim-responsive-table__exportable--table')[table];
        const exportTable = document.createElement('table');

        // Parse table head to new clean markup.
        const tableHead = tableHTML.querySelector('thead');

        if (tableHead) {
            const exportTableHead = document.createElement('thead');
            const exportTableHeadRow = document.createElement('tr');

            let tableHeadColumns = '';
            if (tableHead.querySelector('tr')) {
                tableHeadColumns = tableHead.querySelector('tr').children;
            } else {
                tableHeadColumns = tableHead.children;
            }

            for (let i = 0, j = tableHeadColumns.length; i < j; i++) {
                const exportTableHeadColumn = document.createElement('td');
                exportTableHeadColumn.innerText = tableHeadColumns[i].innerText;
                exportTableHeadRow.appendChild(exportTableHeadColumn);
                exportTableHead.appendChild(exportTableHeadRow);
            }

            exportTable.appendChild(exportTableHead);
        }

        // Parse table body to new clean markup.
        if (tableHTML.querySelector('tbody')) {
            const exportTableBody = document.createElement('tbody');
            const tableBodyRows = tableHTML.querySelector('tbody').children;

            for (let i = 0, j = tableBodyRows.length; i < j; i++) {
                const exportTableBodyRow = document.createElement('tr');
                const columns = tableBodyRows[i].children;

                for (let k = 0, l = columns.length; k < l; k++) {
                    const exportTableBodyColumn = document.createElement('td');
                    const columnSpanValue = columns[k].querySelector('.nbim-responsive-table--value');
                    let columnValue = '';

                    if (columnSpanValue) {
                        columnValue = columnSpanValue.innerText;
                    } else {
                        columnValue = columns[k].innerText;
                    }

                    if (columnValue) {
                        exportTableBodyColumn.innerText = columnValue;
                        exportTableBodyRow.appendChild(exportTableBodyColumn);
                        exportTableBody.appendChild(exportTableBodyRow);
                    }
                }
            }
            exportTable.appendChild(exportTableBody);
        }

        // Parse table foot to new clean markup.
        const tableFoot = tableHTML.querySelector('tfoot');

        if (tableFoot) {
            const exportTableFoot = document.createElement('tfoot');
            const exportTableFootRow = document.createElement('tr');
            let tableFootColumns = '';

            if (tableFoot.querySelector('tr')) {
                tableFootColumns = tableFoot.querySelector('tr').children;
            } else {
                tableFootColumns = tableFoot.children;
            }

            for (let i = 0, j = tableFootColumns.length; i < j; i++) {
                const exportTableFootColumn = document.createElement('td');
                exportTableFootColumn.innerText = tableFootColumns[i].innerText;
                exportTableFootRow.appendChild(exportTableFootColumn);
                exportTableFoot.appendChild(exportTableFootRow);
            }

            exportTable.appendChild(exportTableFoot);
        }

        // The export table to xls file is done with https://sheetjs.com/
        const s2ab = (s) => {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };
        const wb = XLSX.utils.table_to_book(exportTable, { sheet: 'Sheet JS' });
        const wbout = XLSX.write(wb, { bookType: 'xls', bookSST: true, type: 'binary' });
        saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'nbim-data-dump.xls');
    };

    // Start looping out all exportable tables.
    const downloadButtons = document.getElementsByClassName('nbim-responsive-table--folded__download');
    for (let i = 0, j = downloadButtons.length; i < j; i++) {
        downloadButtons[i].addEventListener('click', () => downloadFile(i));
    }
}
