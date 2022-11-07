import lazyScript from './lazyScript';

export default function nbimChartDefault({
    id,
    highchartsUrl = '//code.highcharts.com/highcharts.js',
    dataUrl = 'https://nbim-proto-2018.firebaseapp.com/json/chart-1.json',
    chartTitleText,
    chartSubtitleText,
    chartSubtitleTextMobile,
    chartYAxisTitleText,
    chartSeriesName,
}) {
    document.addEventListener('DOMContentLoaded', () => {
        lazyScript(id, highchartsUrl, 100, () => {
            // eslint-disable-next-line
            $.getJSON(
                dataUrl,
                (data) => {
                    // eslint-disable-next-line
                    Highcharts.chart(id, {
                        credits: false,
                        chart: {
                            zoomType: 'x',
                            style: {
                                fontFamily: '"azo-sans-web", arial, sans-serif',
                                fontStyle: 'normal',
                                fontWeight: '300',
                            },
                        },
                        title: {
                            text: chartTitleText,
                        },
                        subtitle: {
                            // eslint-disable-next-line
                            text: document.ontouchstart === undefined ? chartSubtitleText : chartSubtitleTextMobile,
                        },
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                year: '%Y',
                            },
                        },
                        yAxis: {
                            title: {
                                text: chartYAxisTitleText,
                            },
                            min: 0,
                            labels: {
                                format: '{value:,.0f}',
                            },
                        },
                        legend: {
                            enabled: false,
                        },
                        plotOptions: {
                            series: {
                                lineColor: 'rgba(20, 117, 164, 1)', // rgba for '#1475A4' | ($cl-blue-2)
                                animation: {
                                    duration: 1250,
                                },
                            },
                            area: {
                                fillColor: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 1,
                                    },
                                    stops: [
                                        [0, 'rgba(73, 145, 184, 1)'], // rgba for '#4991B8' | ($cl-blue)
                                        [1, 'rgba(20, 117, 164, 1)'], // rgba for '#1475A4' | ($cl-blue-2)
                                    ],
                                },
                                marker: {
                                    radius: 2,
                                },
                                lineWidth: 1,
                                states: {
                                    hover: {
                                        lineWidth: 1,
                                    },
                                },
                                threshold: null,
                            },
                        },
                        series: [{
                            type: 'area',
                            name: chartSeriesName,
                            data,
                        }],
                    });
                }
            );
        });
    });
}
