/* eslint-disable no-loop-func */
import { saveAs } from 'file-saver';
import nbimTableColumnToggler from './nbimTableColumnToggler';
// import nbimTableScrollIndicator from './nbimTableScrollIndicator';
// TODO: Refactor output. Create elements so that we can access it with js for the scroll indicator.

/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
// eslint-disable-next-line max-len
export default function graphToTable(renderTo, props, renderAsResponsiveTable, exportToXls = false) {
    const renderToElm = document.getElementById(renderTo);
    const { series, timeline } = props;

    if (renderToElm && typeof series === 'object') {
        if (renderToElm.innerHTML !== '') {
            renderToElm.innerHTML = '';
        }

        const output = document.createElement(renderAsResponsiveTable ? 'div' : 'table');

        let thead = '';
        let tbody = '<tr>\n';
        let table = '';
        let currentColumn = 0;
        let currentRow = 0;
        const totalColumns = series.length - 1;
        let totalRows = 0;

        // Sort series by graph index if possible.
        // eslint-disable-next-line no-confusing-arrow
        series.sort((a, b) => (a.index > b.index) ? 1 : -1);

        series.map((data, i) => {
            thead += (timeline && i === 0) ? `<th>&nbsp;</th>\n<th>${data.name}</th>\n` : `<th>${data.name}</th>\n`;

            if (typeof data.data === 'object') {
                if (totalRows === 0) {
                    totalRows = data.data.length;
                }
                // eslint-disable-next-line no-shadow
                for (let y = 0, j = data.data.length; y < j; y++) {
                    const column = (columnValue, toggler) => {
                        if (typeof columnValue === 'undefined') {
                            tbody += '<td></td>\n';
                            return;
                        }

                        tbody += '<td>\n';

                        if (renderAsResponsiveTable) {
                            if (!toggler) {
                                tbody += `<span class="nbim-responsive-table--key">${typeof series[currentColumn].name !== 'undefined' ? series[currentColumn].name : ''}</span>\n`;
                            }
                            tbody += '<span class="nbim-responsive-table--value">\n';
                        }

                        tbody += columnValue;

                        if (renderAsResponsiveTable) {
                            tbody += '</span>\n';

                            if (toggler) {
                                tbody += '<button class="nbim-responsive-table__toggler" aria-haspopup="true" aria-expanded="false"><i class="nbim-responsive-table__toggler--icon"></i></button>\n';
                            }
                        }

                        tbody += '</td>\n';
                    };

                    const rowEnd = () => {
                        // Table body end.
                        if (currentRow === totalRows - 1) {
                            column(series[currentColumn].data[currentRow][1], false);
                            tbody += '</tr>\n';
                        } else {
                            column(series[currentColumn].data[currentRow][1], false);
                            tbody += '</tr>\n<tr>\n';
                            currentColumn = 0;
                            currentRow++;
                        }
                    };

                    if (currentColumn === totalColumns) {
                        if (totalColumns === 0) {
                            column(timeline[currentRow], true);
                        }
                        rowEnd();
                    } else {
                        if (timeline && currentColumn === 0) {
                            column(timeline[currentRow], true);
                            column(series[currentColumn].data[currentRow][1], false);
                        } else {
                            column(series[currentColumn].data[currentRow][1], currentColumn === 0);
                        }
                        currentColumn++;
                    }
                }
            }
        });

        if (renderAsResponsiveTable) {
            table +=
              '<div class="nbim-responsive-table__inner-container">\n'
              + '<div class="nbim-responsive-table nbim-responsive-table--unfolded nbim-responsive-table--restricted-width">\n'
              + '<table>\n';
        }

        table +=
          `${'<thead>\n'
          + '<tr>\n'}${
           thead
           }</tr>\n`
          + '</thead>\n'
          + `<tbody>\n${
           tbody
           }</tbody>\n`;

        if (renderAsResponsiveTable) {
            table +=
              '</table>'
              + '<button class="nbim-responsive-table__scroll-indicator" data-button-text="Scroll og vis mer av tabell">\n'
              + '<i class="nbim-responsive-table__scroll-indicator--icon"></i>\n'
              + '</button>\n'
              + '</div>\n'
              + '</div>\n';

            output.className = 'nbim-responsive-table__outer-container m-t-20 m-b-20';
        }

        output.innerHTML = table;

        if (exportToXls) {
            renderToElm.appendChild(output);
            renderToElm.firstChild.style.display = 'none';

            const tableHTML = renderToElm.firstChild;
            const s2ab = (s) => {
                const buf = new ArrayBuffer(s.length);
                const view = new Uint8Array(buf);
                // eslint-disable-next-line no-bitwise
                for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            };
            const wb = XLSX.utils.table_to_book(tableHTML, { sheet: 'Sheet JS' });
            const wbout = XLSX.write(wb, { bookType: 'xls', bookSST: true, type: 'binary' });
            saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'nbim-data-dump.xls');
        } else {
            renderToElm.appendChild(output);
        }

        // Init nbimTableColumnToggler after appending table.
        nbimTableColumnToggler();
    }
}
