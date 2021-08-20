import React from 'react';
// import './filterdropdown.css';
const FilterDropdown = (props) => {
  // const [filterData, setfilterData] = useState(props.data);
  const options = [
    { label: 'All', value: 'all', group: 'all' },
    { label: 'Deleted', value: 'deleted', group: 'deleted' },
    { label: 'Certificate', value: 'certificate', group: 'softwareType' },
    { label: 'Domain', value: 'domain', group: 'softwareType' },
    { label: 'Software', value: 'software', group: 'softwareType' },
    { label: 'Monthly', value: 'monthly', group: 'billingCycle' },
    { label: 'Yearly', value: 'yearly', group: 'billingCycle' },
    // { label: 'Licenced', value: 'licenced', group: 'time' },
    // { label: 'Pending', value: 'pending', group: 'time' },
  ];
  function handleSelectedStatus(selectedState) {
    props.filterSelect(selectedState);
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
          <i className='fas fa-caret-down'></i>
        </button>
        <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
          {options.map((option) => (
            <li>
              <input
                type='radio'
                onClick={() => {
                  handleSelectedStatus(option);
                }}
                // onChange={(e) => {
                //   if (e.target.checked) {
                //     setfilterData([...filterData]);
                //   }
                //   console.log(e.target.checked, filterData);
                // }}
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
