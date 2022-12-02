// Returns a boolean that determines if date is valid or not
export const dateIsValid = (date) => {
    if (date === '' || date === null) {
        return false;
    }
    // 'date' is not one of the exceptions and is a date, therefore valid
    if (date instanceof Date && !isNaN(date)) {
        return true;
    }
    // not a date
    if (process.env.NODE_ENV !== 'test') {
        // eslint-disable-next-line
        console.error(`[dateIsValid]: 'date' did not pass validation => [${JSON.stringify(date)}]`);
    }
    return false;
};

// Returns a date in format DAY/MONTH/YEAR -> ex: 21/06/2018
export const formatDateUtil = (date) => {
    let newDate = new Date(date);
    if (!dateIsValid(date)) {
        newDate = new Date();
    }
    return `${newDate.getDate()}/${(newDate.getMonth() + 1)}/${newDate.getFullYear()}`;
};

// Returns the YEAR -> ex: 2018
export const getYearUtil = (date) => {
    const newDate = new Date(date);
    if (!dateIsValid(newDate)) {
        if (process.env.NODE_ENV !== 'test') {
            // eslint-disable-next-line
            console.error(`[getYearUtil]: 'date' did not pass validation => [${JSON.stringify(date)}]`);
        }
        return false;
    }
    return `${newDate.getFullYear()}`;
};
