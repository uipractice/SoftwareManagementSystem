import React, { useState, useEffect, useRef } from 'react';
import { useAsyncDebounce } from 'react-table';

function GlobalFilter({ filter, setFilter }) {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const [value, setValue] = useState(filter);
  const handleSubmit = () => {
    setValue('');
  };
  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 1000);
  return (
    <form>
      <input
        ref={inputRef}
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        // TODO: Uncomment and hide the search icon on keypress.
        type="search"
        placeholder='Search'
        id='search'
        className={value ? 'searchClose' : ''}
      />
      <button
        type='reset'
        className='close-icon'
        onClick={handleSubmit}
      ></button>
    </form>
  );
}

export default GlobalFilter;
