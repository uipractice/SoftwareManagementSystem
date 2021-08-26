import React, { useEffect, useState } from 'react';
import './filter.css';

const options = [
  { label: 'All', value: 'all', group: 'all' },
  { label: 'Deleted', value: 'deleted', group: 'status' },
  { label: 'Certificate', value: 'certificate', group: 'softwareType' },
  { label: 'Domain', value: 'domain', group: 'softwareType' },
  { label: 'Software', value: 'software', group: 'softwareType' },
  { label: 'Monthly', value: 'monthly', group: 'billingCycle' },
  { label: 'Yearly', value: 'yearly', group: 'billingCycle' },
  // { label: 'Licenced', value: 'licenced', group: 'time' },
  // { label: 'Pending', value: 'pending', group: 'time' },
];

const FilterDropdown = ({ filterSelect }) => {
  const [checkInfo, setCheckInfo] = useState({});

  useEffect(() => {
    if (checkInfo) {
      filterSelect(checkInfo);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkInfo]);

  function handleSelectedStatus({ target: { name, value } }) {
    let state = { [name]: value };
    if (!['all'].includes(value)) {
      state = { ...checkInfo, ...state };
      delete state.all;
    }
    setCheckInfo(state);
  }

  return (
    <>
      <div className='dropdown'>
        <button
          className='button'
          type='button'
          id='dropdownMenuButton1'
          data-bs-toggle='dropdown'
          aria-expanded='false'
        >
          Filters
          <i className='caret-down'></i>
        </button>

        <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
          {options.map((option, i) => (
            <li key={i}>
              <input
                name={option.group}
                value={option.value}
                checked={checkInfo[option.group] === option.value}
                type='radio'
                onChange={handleSelectedStatus}
              />
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FilterDropdown;
