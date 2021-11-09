import React, {useEffect, useState } from 'react';
import { useAsyncDebounce } from 'react-table';

function GlobalFilter({ setFilter,removeSearchValue }) {

  const [searchText, setSearchText] = useState();
  useEffect(()=>{
    if(removeSearchValue ==='empty'){
      setSearchText('');
      onChange('');
    }
  },[removeSearchValue])
  const onChange = useAsyncDebounce((value) => {
    setFilter(value);
  }, 1000);
  return (
    <form>
      <input
      onChange={(e) => {
        const value = e.target.value !== ' ' && e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
        if(value && value.match(/[a-zA-Z0-9]+([\s]+)*$/)){
        setSearchText(value);
        onChange(value);
        }else{
          setSearchText('');
          onChange(value);
        }
      }}
        type='search'
        placeholder='Search'
        id='search'
        className={searchText ? 'searchClose' : ''}
        value={searchText}
      />
      <button
        type='reset'
        className='close-icon'
        onClick={() => {
          setSearchText('');
          onChange('');
        }}
      ></button>
    </form>
  );
}

export default GlobalFilter;
