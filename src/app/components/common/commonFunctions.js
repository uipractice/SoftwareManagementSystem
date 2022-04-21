import moment from "moment";

export const findFilteredData = (filterState,data, filterKeys) =>{
   return filterKeys.reduce((result, key) => {
        const filteredDataResult = result.filter((row) => {
          if (filterKeys.includes(key)) {
            if (filterState[key] === 'all') {
              return row.status !== 'deleted';
            } else if (filterState[key] === 'deleted') {
              if (filterState['softwareType'] && row.status === 'deleted') {
                return row[key] === filterState[key];
              }
              if (filterState['billingCycle'] && row.status === 'deleted') {
                return row[key] === filterState[key];
              }
              return row.status === 'deleted';
            } else if (filterState[key] === 'expired') {
              if (row.status !== 'deleted') {
                const todaysDate = moment().format('YYYY-MM-DD');
                const days = moment(row.nextBilling, 'YYYY-MM-DD').diff(
                  moment(todaysDate),
                  'days'
                );
                if (days < 0) {
                  if (key === 'softwareType') {
                    return row['softwareType'] === filterState['softwareType'];
                  }
                  if (key === 'billingCycle') {
                    return row['billingCycle'] === filterState['billingCycle'];
                  }
                  return row;
                }
              }
            } else {
              return row[key] === filterState[key] && row.status !== 'deleted';
            }
          }
        });
        result = [...filteredDataResult];
        return result;
      }, data);
}
