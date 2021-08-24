import React, { useEffect, useState } from 'react';
import './filterdropdown.css';
import isEmpty from 'lodash';

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

const FilterDropdown = (props) => {
  const [checkInfo, setCheckInfo] = useState({});

  useEffect(() => {
    if (checkInfo) {
      props.filterSelect(checkInfo);
    }
    console.log('effect', checkInfo);
  }, [checkInfo]);

  function handleSelectedStatus(selectedState, e) {
    // if (e.target.checked) {
    setCheckInfo({
      ...checkInfo,
      [e.target.name]: e.target.value,
    });
  }
  // console.log(checkInfo, props.filterSelect(checkInfo));

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
          {options.map((option) => (
            <li>
              <input
                name={option.group}
                value={option.value}
                checked={checkInfo[option.group] === option.value}
                type='radio'
                onChange={(e) => {
                  // handleSelectedStatus(option, e);

                  handleSelectedStatus(option, e);
                  // props.filterSelect(checkInfo);
                }}
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
