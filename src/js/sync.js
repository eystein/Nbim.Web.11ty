import Highcharts from 'highcharts';
import lazyScript from './lazyScript';
import {
    // the chart initiator
    renderChart,
} from './nbimCharts';
import nbimToggler from './nbimToggler';

window.lazyScript = lazyScript;
window.renderChart = renderChart;
window.Highcharts = Highcharts;
window.nbimToggler = nbimToggler;
