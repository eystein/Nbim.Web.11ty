/* eslint-disable no-console */

import { isEmptyArray } from './isEmptyUtil';
import { getYearUtil } from './formatDateUtil';

export const getYears = a => a.map(m => getYearUtil(...m));

export function isObject(value) {
    if (value && typeof value === 'object' && value.constructor === Object) {
        return true;
    }
    return false;
}

export function getSeriesTimeline(series) {
    if (!series) {
        if (process.env.NODE_ENV !== 'test') {
            console.error('[getSeriesTimeline]: the expected "series" object was not passed to "getSeriesTimeline"');
        }
        return false;
    } else if (series && !series.data) {
        if (process.env.NODE_ENV !== 'test') {
            console.error('[getSeriesTimeline]: the "series" object does not have a "data" key');
        }
        return false;
    } else if (series && series.data && !Array.isArray(series.data)) {
        if (process.env.NODE_ENV !== 'test') {
            console.error(`[getSeriesTimeline]: (${JSON.stringify(series.data)}) is not an array!`);
        }
        return false;
    }
    // Because we did all the checks that guarantee 'series.data':
    // - is defined
    // - is an array
    if (!isEmptyArray(series.data)) {
        if (isObject(series.data[0])) {
            return false;
        }
        return getYears(series.data);
    }
    if (process.env.NODE_ENV !== 'test') {
        console.warning('[getSeriesTimeline]: returning an empty array!');
    }
    return [];
}

export function sliceData(data, sliceBy) {
    if (sliceBy) {
        return data.slice(Math.max(data.length - sliceBy, 0));
    }
    return data;
}
