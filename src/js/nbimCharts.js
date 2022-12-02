/* eslint-disable no-param-reassign */
/* eslint-disable no-loop-func */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-console */

import Highcharts from 'highcharts';
import merge from 'deepmerge';
import graphToTable from './graphToTable';

import lazyScript from './lazyScript';
import { hasClass, isEmpty, isIE11 } from './helpers';
import { getSeriesTimeline, sliceData } from '../../utils/chartsUtils';

// Define shared/default values for each chart type. These objects will be passed to
//  'renderTheChart' function, which in turn will be merged with editor-defined values
//  and passed to the final 'Highcharts' object

const sharedChartOptions = {
    lang: {
        decimalPoint: '.',
        thousandsSep: ',',
    },
    global: {
        useUTC: true,
    },
    chart: {
        backgroundColor: 'transparent',
        style: {
            fontFamily: 'azo-sans-web, arial, sans-serif',
            fontStyle: 'normal',
            fontWeight: '300',
        },
    },
    credits: {
        enabled: false,
    },
    title: {
        text: null,
    },
    navigator: {
        enabled: false,
        allButtonsEnabled: false,
        series: {
            includeInCSVExport: false,
        },
    },
    legend: {
        enabled: false,
        layout: 'horizontal',
        verticalAlign: 'bottom',
        borderWidth: 0,
        floating: false,
        align: 'left',
        margin: 40,
        itemStyle: {
            textDecoration: 'none',
        },
    },
    exporting: {
        enabled: false,
    },
};

// Set 'yAxis' separately so that we can merge default values (aharedYAxis) with passed values (optionsYAxis)
const sharedYAxis = [
    {
        title: {
            text: '',
        },
        gridLineWidth: 1,
        lineWidth: 1,
    },
    {
        title: {
            text: '',
        },
        gridLineWidth: 1,
        lineWidth: 1,
        linkedTo: 0,
        opposite: true,
        visible: true,
    },
];

const sharedChartPropsArea = {
    chart: {
        type: 'area',
    },
    xAxis: {
        type: 'datetime',
        tickInterval: 365 * 24 * 1000 * 3600,
    },
    plotOptions: {
        column: {},
        line: {
            marker: {
                enabled: false,
            },
        },
    },
    exporting: {
        csv: {
            dateFormat: '%Y',
            decimals: '0',
        },
    },
};

const sharedChartPropsColumn = {
    chart: {
        type: 'column',
    },
    xAxis: {
        type: 'datetime',
        tickInterval: 365 * 24 * 1000 * 3600,
    },
    plotOptions: {
        column: {
            stacking: 'normal',
        },
        line: {
            marker: {
                enabled: false,
            },
        },
    },
    exporting: {
        csv: {
            dateFormat: '%Y',
            decimals: '0',
        },
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500,
            },
            chartOptions: {
                xAxis: {
                    tickInterval: 3600 * 24 * 1000 * 3600,
                },
            },
        }],
    },
};

const sharedChartPropsPie = {
    chart: {
        type: 'pie',
    },
    plotOptions: {
        pie: {
            size: '75%',
            slicedOffset: 0,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y}',
                style: {
                    fontFamily: '\'AzoSans Light\', sans-serif',
                    fontSize: '14px',
                    fontWeight: 'normal',
                },
            },
            startAngle: -90,
            endAngle: 270,
        },
    },
};

const sharedChartPropsLine = {
    chart: {
        type: 'line',
    },
    xAxis: {
        type: 'datetime',
        tickInterval: 365 * 24 * 1000 * 3600,
    },
    plotOptions: {
        column: {},
        line: {
            marker: {
                enabled: false,
            },
        },
    },
    exporting: {
        csv: {
            dateFormat: '%d-%m-%Y',
            decimals: '2',
        },
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500,
            },
            chartOptions: {
                xAxis: {
                    tickInterval: 3600 * 24 * 1000 * 3600,
                },
            },
        }],
    },
};

export function initChart({
    renderTo,
    reflowStatus,
    data,
    chartType = 'column', // area | column | line | pie
    showFilter = false,
    buttonHeader = '',
    buttonActiveText = '',
    buttonsInactive = [],
    extras = {},
    optionsYAxis = [],
    optionsChart = {},
}) {
    // Don't proceed if 'renderTo' element is not found on the page
    const el = document.getElementById(renderTo);
    if (el) {
        const {
            series = [],
            timeline = [],
        } = data;
        // Don't proceed if 'series' is not defined
        if (!isEmpty(series)) {
            // Extract 'timeline' from 'series', and set it to the 'data' object
            data.timeline = isEmpty(timeline) ? getSeriesTimeline(series[0]) : timeline;
            // Set shared 'props' for each chart type
            let sharedChartProps = null;
            switch (chartType) {
                case 'area':
                    sharedChartProps = sharedChartPropsArea;
                    break;
                case 'column':
                    sharedChartProps = sharedChartPropsColumn;
                    break;
                case 'line':
                    sharedChartProps = sharedChartPropsLine;
                    break;
                case 'pie':
                    sharedChartProps = sharedChartPropsPie;
                    break;
                default:
                    sharedChartProps = sharedChartPropsColumn; // syntax sugar, we already get it as default when deconstructing 'props'
                    console.warn('[initChart] No value was passed for "chartType" (area, column, line, pie), so we fell back to the default "column"');
            }
            // Render 'extras' conditionally (if 'extras.status' is set to true)
            const renderExtras = (props) => {
                // This function will create and render the necessary markup that shows both the
                //  'show as table' and 'download as XLS' buttons, if the person creating the chart
                //  chooses to show them
                const {
                    status = false,
                    showAsTableTextOff = 'Vis som tabell',
                    showAsTableTextOn = 'Lukk tabell',
                    downloadXLSText = 'Last ned Excell fil',
                } = extras;
                // Retrieve element into which all new elements will be appended to
                const elExtras = document.getElementById(`${renderTo}__extras`);
                // Only do any of this if the editor has chosen to show extras
                if (status && elExtras) {
                    // Prepare ids and classes
                    const idExtrasRenderTable = `${renderTo}-render-table`; // div
                    const idExtrasButtonTable = `${renderTo}-show-as-table`; // button
                    const idExtrasButtonDownload = `${renderTo}-download-xls`; // button
                    const idExtrasRenderTable2 = `${renderTo}-download-xls-table`; // button
                    // Don't re-append markup. Just re-render table.
                    if (elExtras.innerHTML === '') {
                        // Prepare ids and classes
                        const classesExtrasWrapper = ['section__graph-table__footer']; // div
                        const classesExtrasItems = ['section__graph-table__footer__links']; // ul
                        const classesExtrasRenderTable = ['chart-table-container']; // div
                        const classesExtrasButtonDownload = ['download']; // button
                        // Create elements
                        const extrasWrapper = document.createElement('div');
                        const extrasItems = document.createElement('ul');
                        const extrasItem1 = document.createElement('li');
                        const extrasItem2 = document.createElement('li');
                        const extrasButtonTable = document.createElement('button');
                        const extrasRenderTable = document.createElement('div');
                        const extrasRenderTable2 = document.createElement('div');
                        const extrasButtonDownload = document.createElement('button');
                        // Add ids
                        extrasRenderTable.setAttribute('id', idExtrasRenderTable);
                        extrasButtonTable.setAttribute('id', idExtrasButtonTable);
                        extrasButtonDownload.setAttribute('id', idExtrasButtonDownload);
                        extrasRenderTable2.setAttribute('id', idExtrasRenderTable2);
                        // Add classes
                        extrasWrapper.classList.add(...classesExtrasWrapper);
                        extrasItems.classList.add(...classesExtrasItems);
                        extrasRenderTable.classList.add(...classesExtrasRenderTable);
                        extrasButtonDownload.classList.add(...classesExtrasButtonDownload);
                        // Add aria
                        extrasButtonTable.setAttribute('aria-haspopup', 'true');
                        extrasButtonTable.setAttribute('aria-expanded', 'false');
                        // Add content to created elements
                        extrasButtonTable.innerText = showAsTableTextOff;
                        extrasButtonDownload.innerText = downloadXLSText;
                        // Append elements
                        extrasWrapper.appendChild(extrasItems);
                        extrasItems.appendChild(extrasItem1);
                        extrasItems.appendChild(extrasItem2);
                        extrasItem1.appendChild(extrasButtonTable);
                        extrasItem1.appendChild(extrasRenderTable);
                        extrasItem2.appendChild(extrasButtonDownload);
                        extrasItem2.appendChild(extrasRenderTable2);
                        // Append 'extras' elements to their wrapper in the markdown
                        elExtras.appendChild(extrasWrapper);
                        // Now that we have the markup on the DOM, retrieve elements that will get event handlers
                        const extrasButtonTableDOM = document.getElementById(idExtrasButtonTable);
                        const extrasRenderTableDOM = document.getElementById(idExtrasRenderTable);
                        const extrasButtonDownloadDOM = document.getElementById(idExtrasButtonDownload);
                        // On click event for 'show as table'
                        if (extrasButtonTableDOM) {
                            extrasButtonTableDOM.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Toggle class
                                if (hasClass(extrasButtonTableDOM, 'selected')) {
                                    extrasButtonTableDOM.classList.remove('selected');
                                    extrasButtonTableDOM.innerText = showAsTableTextOff;
                                } else {
                                    extrasButtonTableDOM.classList.add('selected');
                                    extrasButtonTableDOM.innerText = showAsTableTextOn;
                                }
                                // Do what we came here for
                                if (hasClass(extrasButtonTableDOM, 'selected')) {
                                    extrasButtonTableDOM.setAttribute('aria-expanded', 'true');
                                    extrasRenderTableDOM.classList.add('selected');
                                    graphToTable(`${renderTo}-render-table`, props, true, false);
                                } else {
                                    extrasButtonTableDOM.setAttribute('aria-expanded', 'false');
                                    extrasRenderTableDOM.classList.remove('selected');
                                }
                            });
                        }
                        // On click event for 'show as table'
                        if (extrasButtonDownloadDOM) {
                            if (typeof XLSX !== 'undefined') {
                                extrasButtonDownloadDOM.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    graphToTable(`${renderTo}-download-xls-table`, props, false, true);
                                });
                            } else {
                                const dlButton = document.getElementById(`${renderTo}-download-xls`);
                                dlButton.style.display = 'none';
                            }
                        }
                    }
                }
            };
            // Render the chart
            const renderTheChart = (props) => {
                // This function merges all shared/default 'props' with the ones that are passed to the
                //  chart by the editors. We pass the merged object to the 'Chart' method of 'Highcharts',
                //  making this the place where "it happens"
                // Retrieve shared/default 'props'
                const localChartProps = { ...props };
                // Merge shared/default 'props' with those set/passed down by editors
                const allProps = merge(sharedChartProps, localChartProps);
                // The block below is there so that we can merge a shared/default array with the one
                //  passed down by editors.
                const emptyTarget = value => Array.isArray(value) ? [] : {};
                const clone = (value, options) => merge(emptyTarget(value), value, options);
                const combineMerge = (target, source, options) => {
                    const destination = target.slice();
                    for (let i = 0; i < source.length; i++) {
                        if (typeof destination[i] === 'undefined') {
                            const cloneRequested = options.clone !== false;
                            const shouldClone = cloneRequested && options.isMergeableObject(source[i]);
                            destination[i] = shouldClone ? clone(source[i], options) : source[i];
                        } else if (options.isMergeableObject(source[i])) {
                            destination[i] = merge(target[i], source[i], options);
                        } else if (target.indexOf(source[i]) === -1) {
                            destination.push(source[i]);
                        }
                    }
                    return destination;
                };
                // Merge default values (sharedYAxis) with passed values (optionsYAxis)
                const mergedYAxisArray = merge(
                    sharedYAxis,
                    optionsYAxis,
                    { arrayMerge: combineMerge }
                );
                // Assign resulting array to its rightfull property in the 'Highcharts' object
                const mergedYAxisObject = {
                    yAxis: mergedYAxisArray,
                };
                // Merge the property set above with the previously merged 'allProps'
                const allPropsWithYAxis = merge(allProps, mergedYAxisObject);
                // Set the shared options
                Highcharts.setOptions({
                    ...sharedChartOptions,
                });
                // Create a 'Chart' instance and pass all merged props
                const theChart = () => new Highcharts.Chart({
                    ...allPropsWithYAxis,
                });
                // Invoke the chart!
                theChart();
                // Show the extras (we check for 'status' from within 'renderExtras')
                renderExtras(props);
            };
            // If filter is set to be shown, we have the buttons' wrapper in the DOM and
            //  we're not on IE11, build and render the filter buttons
            const elButtons = document.getElementById(`${renderTo}__buttons`);
            if (showFilter && elButtons && !isIE11) {
                // Prepare classes
                const classesElButtons = ['range-selector__wrapper', 'm-b-20'];
                const classesBtnsWrapper = ['d-flex', 'align-items-center', 'range-selector', `range-selector--${renderTo}`]; // div
                const classesBtnsHeader = ['range-selector__title', 'm-r-10']; // h4
                const classesBtnActive = ['button--bordered', 'range-selector__btn', 'm-r-5']; // button
                const classesBtnsInactive = ['button--bordered--inactive', 'range-selector__btn', 'm-r-5']; // button
                // Create elements
                const btnsWrapper = document.createElement('div');
                const btnsHeader = document.createElement('h4');
                const btnActive = document.createElement('button');
                // Add classes
                elButtons.classList.add(...classesElButtons);
                btnsWrapper.classList.add(...classesBtnsWrapper);
                btnsHeader.classList.add(...classesBtnsHeader);
                btnActive.classList.add(...classesBtnActive);
                // Add content to created elements
                btnsHeader.innerText = `${buttonHeader}:`;
                btnActive.innerText = buttonActiveText;
                // Append elements
                btnsWrapper.appendChild(btnsHeader);
                btnsWrapper.appendChild(btnActive);
                // Create buttons
                if (buttonsInactive.length) {
                    for (const item of buttonsInactive) {
                        const btn = document.createElement('button');
                        btn.classList.add(...classesBtnsInactive);
                        btn.innerText = item.text;
                        btn.setAttribute('value', item.value);
                        btnsWrapper.appendChild(btn);
                    }
                }
                // Append buttons to DOM
                elButtons.appendChild(btnsWrapper);
                // Find buttons on DOM, set events and do things accordingly
                const buttons = document.querySelectorAll(`#${renderTo}__buttons .range-selector__btn`);
                let selectedButton = document.querySelector(`#${renderTo}__buttons .button--bordered`);
                // Create an array to store the parameters that will be passed to each chart,
                // once we have looped through all buttons and sliced their respective data
                const buttonsChartData = [];
                for (let i = 0; i < buttons.length; i++) {
                    const valueToSend = buttons[i].getAttribute('value');
                    // If the value is not undefined, filter the data
                    if (!valueToSend) {
                        buttonsChartData.push(data);
                    } else {
                        // Create an object to store the data to be pushed into 'buttonsChartData'
                        const dataToReturn = {
                            ...data,
                            series: [],
                            timeline: [],
                        };
                        // Slice all items within series
                        for (let y = 0, z = data.series.length; y < z; y++) {
                            const slicedData = sliceData(data.series[y].data, valueToSend);
                            // Very important step below, always deconstruct 'data.series[y]'!
                            const seriesToPush = { ...data.series[y], data: slicedData };
                            dataToReturn.series.push(seriesToPush);
                        }
                        // Slice timeline
                        const slicedTimeline = sliceData(data.timeline, valueToSend);
                        dataToReturn.timeline = slicedTimeline;
                        buttonsChartData.push(dataToReturn);
                    }
                }
                for (let q = 0; q < buttons.length; q++) {
                    // Do things on click each click event
                    buttons[q].addEventListener('click', () => {
                        if (buttons[q] !== selectedButton) {
                            selectedButton.classList.remove('button-bordered');
                            selectedButton.classList.add('button--bordered--inactive');
                            buttons[q].classList.remove('button--bordered--inactive');
                            buttons[q].classList.add('button--bordered');
                            selectedButton = buttons[q];
                            // This is where the click event magic happens...
                            // Each button gets its own set of paramemters (from 'buttonsChartData' array),
                            // which are in turn passed to their own chart render
                            renderTheChart({
                                chart: {
                                    renderTo,
                                    reflow: reflowStatus,
                                    ...optionsChart,
                                    height: parseInt(optionsChart.height, 10) || 600,
                                },
                                ...data,
                                ...buttonsChartData[q],
                            });
                        }
                    });
                }
            } else {
                if (showFilter && buttonActiveText) {
                    console.log(`[initChart] %c'buttonActiveText' has a value, but  '${renderTo}__buttons' was not found on the page. You either forgot to enable the filter or you don't need to define 'buttonActiveText'`, 'background: #f9efb4; color: black');
                }
                if (showFilter && !isEmpty(buttonsInactive)) {
                    console.log(`[initChart] %c'buttonsInactive' has a value, but '${renderTo}__buttons' was not found on the page. You either forgot to enable the filter or you don't need to define 'buttonsInactive'`, 'background: #f9efb4; color: black');
                }
            }
            // This function is rendered on 1st run
            renderTheChart({
                chart: {
                    reflow: reflowStatus,
                    renderTo,
                    ...optionsChart,
                    height: parseInt(optionsChart.height, 10) || 600,
                },
                ...data,
            });
            return null;
        }
        console.warn(`[initChart] The 'series' prop (${renderTo}) was not passed. You will need it to get the graph rendered.`);
        return null;
    }
    console.warn(`[initChart] The element with id '${renderTo}' was not found on the page. You will need it to get the graph rendered.`);
    return null;
}

export const toggleCurrencySelection = ({
    chartNok,
    chartUsd,
    selectNok,
    selectUsd,
    buttonsNok,
    buttonsUsd,
    extrasNok,
    extrasUsd,
    sourceTextNok,
    sourceTextUsd,
}) => {
    if (chartNok && chartUsd && selectNok && selectUsd) {
        selectNok.addEventListener('click', () => {
            chartNok.classList.remove('hide');
            chartUsd.classList.add('hide');
            if (buttonsNok && buttonsUsd) {
                buttonsNok.classList.remove('hide');
                buttonsUsd.classList.add('hide');
            }
            if (extrasNok && extrasUsd) {
                extrasNok.classList.remove('hide');
                extrasUsd.classList.add('hide');
            }
            if (sourceTextNok && sourceTextUsd) {
                sourceTextNok.classList.remove('hide');
                sourceTextUsd.classList.add('hide');
            }
        });
        selectUsd.addEventListener('click', () => {
            chartNok.classList.add('hide');
            chartUsd.classList.remove('hide');
            if (buttonsNok && buttonsUsd) {
                buttonsNok.classList.add('hide');
                buttonsUsd.classList.remove('hide');
            }
            if (extrasNok && extrasUsd) {
                extrasNok.classList.add('hide');
                extrasUsd.classList.remove('hide');
            }
            if (sourceTextNok && sourceTextUsd) {
                sourceTextNok.classList.add('hide');
                sourceTextUsd.classList.remove('hide');
            }
        });
        return null;
    }
    // eslint-disable-next-line
    console.warn('[toggleCurrencySelection]: one of the expected elements is not defined');
    return null;
};

export function renderChart(props) {
    if (props.id1 && props.id1.id) {
        const options1 = props.id1.options ? props.id1.options : {};
        const doIt = () => {
            initChart({
                renderTo: props.id1.id,
                reflowStatus: props.reflowStatus,
                chartType: props.type,
                data: {
                    series: props.id1.series,
                    ...options1,
                },
                height: props.height,
                showFilter: props.showFilter,
                buttonHeader: props.buttonHeader,
                buttonActiveText: props.buttonActiveText,
                buttonsInactive: props.buttonsInactive,
                extras: props.extras,
                optionsYAxis: props.id1.optionsYAxis,
                optionsChart: props.optionsChart,
            });
            if (props.id2 && props.id2.id) {
                const options2 = props.id2.options ? { ...options1, ...props.id2.options } : options1;
                initChart({
                    renderTo: props.id2.id,
                    reflowStatus: props.reflowStatus,
                    chartType: props.type,
                    data: {
                        series: props.id2.series,
                        ...options2,
                    },
                    height: props.height,
                    showFilter: props.showFilter,
                    buttonHeader: props.buttonHeader,
                    buttonActiveText: props.buttonActiveText,
                    buttonsInactive: props.buttonsInactive,
                    extras: props.extras,
                    optionsYAxis: props.id2.optionsYAxis,
                    optionsChart: props.optionsChart,
                });
                toggleCurrencySelection({
                    chartNok: document.getElementById(props.id1.id),
                    chartUsd: document.getElementById(props.id2.id),
                    selectNok: document.getElementById(`currency-${props.id1.id}`),
                    selectUsd: document.getElementById(`currency-${props.id2.id}`),
                    extrasNok: document.getElementById(`${props.id1.id}__extras`),
                    extrasUsd: document.getElementById(`${props.id2.id}__extras`),
                    buttonsNok: document.getElementById(`${props.id1.id}__buttons`),
                    buttonsUsd: document.getElementById(`${props.id2.id}__buttons`),
                    sourceTextNok: document.getElementById(`${props.id1.id}__source-text`),
                    sourceTextUsd: document.getElementById(`${props.id2.id}__source-text`),
                });
            }
        };
        // Always lazy-load unless 'notLazy' is set to true or netlife.inCMSPreview is set to true in windows.
        if (props.notLazy || (typeof window === 'object' && window.netlife.inCMSPreview)) {
            doIt();
        } else {
            lazyScript(props.id1.id, null, 100, () => {
                doIt();
            });
        }
    } else {
        // eslint-disable-next-line
        console.warn('[renderChart]: Either "props.id1" or "props.id1.id" is/are not defined');
    }
}
