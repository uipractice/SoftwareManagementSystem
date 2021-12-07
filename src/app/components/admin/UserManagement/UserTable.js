import React, { useEffect, useState, useCallback } from 'react';
import DeleteImg from '../../../assets/images/delete-icon.svg';
import Renew from '../../../assets/images/Renew.png';
import UpDownImg from '../../../assets/images/sorting.svg';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useExpanded
} from 'react-table';
import '../../table/table.css';
import GlobalFilter from '../../table/GlobalFilter';
import rightIcon from '../../../assets/images/right-icon.svg';
import leftIcon from '../../../assets/images/left-icon.svg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import Form from '../../admin/Form';
import { getApiUrl } from '../../utils/helper';
import FilterDropdown from '../../table/FilterDropdown';
import Download from '../../../assets/images/download.svg';
import Note from '../../../assets/images/note.svg';

toast.configure();
function UserTable({ data,sortByDateCreated, getEditForm }) {
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const [rowData, setRowData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditFormOpen, toggleEditForm] = useState(false);
  const [show, setShow] = useState(false);
  const [noRecords, setNoRecords] = useState(false);

  const [enteredValue, setEnteredValue] = useState('');
  const [emptySearch,setSearchText]=useState('');
  const [selectedFilter,setSelectedFilter]=useState({})

  const setDefaultFilterData = useCallback((filterData) => {
    if (filterData?.length) {
      let filterResult = filterData.filter((row) => row.status !== 'deleted');
      setFilteredData(addSerialNo(filterResult));
    }
  }, []);
  const addSerialNo = (dataArr = [], tableFilter = false) => {
    return dataArr?.map((value, index) => ({
      ...(tableFilter ? value.original : value),
      serial: index + 1,
    }));
  };
  useEffect(() => {
    setDefaultFilterData(data);
  }, [setDefaultFilterData, data,sortByDateCreated]);

  function handleInputChange(evt) {
    const value = evt.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
    if (value.match(/[a-zA-Z0-9]+([\s]+)*$/)) {
      setRowData({
        ...rowData,
        deleteReason: value,
      });
    } else {
      setRowData({
        ...rowData,
        deleteReason: '',
      });
    }
  }
  const handleUpdateStatus = (e) => {
    e.preventDefault();
    rowData.status = 'deleted';
    const id = rowData._id;
    axios
    .delete(getApiUrl(`users/deleteUser/${id}`))
      .then((res) => {
        toast.success('Data deleted successfully!', {
          autoClose: 1000,
        });
        setIsModalOpen(false);
        console.log(res.data);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => console.log(err.response));
  };
  const customSorting = (c1, c2,header) => {

    if(header==='TIMELINE')
    {
      if(c1===c2){
        return 0
      }
      else if(c1 <0){
        return 1
      }
      else if (c2 <0){
        return -1
      }
      else if (c1<c2){
        return -1
      }
      
      
    }else{
      if(c1 !== undefined && c2 !==undefined)
     return c1.localeCompare(c2, undefined, { numeric: true });
    }
    

  };
  const getTimeLineClass = (days) => {
    return days >= 7
    ? 'timelineYellow'
    : 'timelineRed'
  }
  const getExpiredDays = (days) => {
    return days ===1
    ? ''
    : 's'
  }
  const getExpiredText = (days) => {
    return  days < 0
    ? `Expired`
    : `${days} day${getExpiredDays(days)}`
  }
  const columns = React.useMemo(
    () => [
      {
        Header: 'NAME',
        accessor: 'userName',
        sticky: 'left',
        width: 250,
        sortType: (a, b) => {
          return customSorting(
            a.original.userName,
            b.original.userName
          );
        },
      },
      {
        Header: 'USER ID/EMAIL ADDRESS',
        accessor: 'emailId',
        sticky: 'left',
        width: 300,
        sortType: (a, b) => {
          return customSorting(a.original.emailId, b.original.emailId);
        },
      },
      {
        Header: 'ROLE',
        accessor: 'role',
        width: 150,
        sortType: (a, b) => {
          return customSorting(a.original.role, b.original.role);
        },
      },
      {
        Header: 'TEAM',
        accessor: 'team',
        width: 200,
        sortType: (a, b) => {
          return customSorting(
            a.original.team,
            b.original.team
          );
        },
      },
      // {
      //   Header: 'Date Created',
      //   accessor: 'createdAt',
      //   width: 10,
      //   isVisible:"false"
      // },
      {
        Header: 'CONTACT NO',
        accessor: 'contactNumber',
        sticky: 'left',
        width: 150,
      },
      {
        Header: 'STATUS',
        accessor: 'status',
        width: 200,
        sortType: (a, b) => {
          if (a.original.status === undefined) {
            a.original['status'] = '';
          }
          if (b.original.status === undefined) {
            b.original['status'] = '';
          }
          return customSorting(a.original.status, b.original.status);
        },
      },
      {
        Header: 'ACTION',
        width: 150,
        Cell: ({ row }) => (
          <div>
            <img
              className={`p-2 pointer ${
                row.original.status === 'deleted' ? 'disableEditBtn' : ''
              }`}
              src={Renew}
              alt='Evoke Technologies'
              height='31px'
              onClick={() => {
                getEditForm(row);
              }}
            />
            <img
              className={`p-2 pointer ${
                row.original.status === 'deleted' ? 'disableDeleteBtn' : ''
              }`}
              src={DeleteImg}
              alt='Evoke Technologies'
              onClick={() => {
                setRowData(row.original);
                setIsModalOpen(true);
              }}
            />
          </div>
        ),
      },
    ],
    []
  );

  // Download the signed urls fetched from S3.
  const downloadFiles = (filesUrls, fileNames) => {
    let index = 0;
    for (let file of filesUrls) {
      const link = document.createElement('a');
      link.href = file;
      link.target = '_blank';
      link.setAttribute('id', 'downloadFile');
      link.setAttribute('download', fileNames[index]);
      document.body.appendChild(link);
      link.click();
      index += 1;
      document.getElementById('downloadFile')?.remove();
    }
  };

  

  const renderRowSubComponent = useCallback(
    ({ row }) => (
      <td colSpan='12' className='rowexpandable'>
        <div className='subscrit'>
          <h3 className='rowexpandfont'>Subscription for:</h3>
          {row.original.billingDetails
            .slice(-6)
            // .reverse()
            .map((item, i) => (
              <div key={i} className='label text-capitalize'>
                <label>
                  {item.billingMonth}{' '}
                  {item.description && (
                    <img
                      className='px-2 pointer'
                      src={Note}
                      title={item.description}
                      alt='description'
                    />
                  )}{' '}
                </label>
              </div>
            ))}
          {row.original.billingDetails?.length > 6 && (
            <div style={{ alignSelf: 'flex-end', margin: '18px 0' }}>
              <button
                onClick={() => {
                  setShow(true);
                  setRowData(row.original);
                }}
              >
                Show All
              </button>
            </div>
          )}
        </div>
      </td>
    ),
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    // setPageSize,
    prepareRow,
    state,
    setGlobalFilter,
    rows: filteredTableData,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: {
        pageSize: 5,
        autoResetSortBy:false,
        manualSortBy:true,
        hiddenColumns: ['createdAt'],
        sortBy: [
          {
            id:sortByDateCreated===false ?'billingCycle':'createdAt',
            desc:sortByDateCreated===false?false:true
          },
          {
            id:sortByDateCreated===false?'TIMELINE':'createdAt',
            desc:sortByDateCreated===false?false:true
          },
        ],
      },
    },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  );
  const { globalFilter, pageIndex, pageSize } = state;

  var start, end;
  if (pageIndex === 0) {
    start = 1;
    end = filteredData.length > pageSize ? pageSize : filteredData.length;
  } else {
    start = pageIndex * pageSize + 1;
    end =
      filteredData.length >= (pageIndex + 1) * pageSize
        ? (pageIndex + 1) * pageSize
        : filteredData.length;
  }

  useEffect(() => {
    if (filteredTableData?.length && globalFilter && searchValue){
      setFilteredData(addSerialNo(filteredTableData, true));
      setEnteredValue('');
      setNoRecords(false);
    }
    else if (searchValue === ''){
      setFilteredData(addSerialNo(data));
      onFilterSelect(selectedFilter);
      setEnteredValue('')
      setNoRecords(false);
    } 
    if(filteredTableData.length === 0 && searchValue) {
      setNoRecords(true);
    }else{
      setNoRecords(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const onFilterSelect = (filterState) => {
    console.log("filter state",filterState)
    setSelectedFilter(filterState)
    setSearchText('empty')
    const filterKeys = Object.keys(filterState);
   
    if (filterKeys?.length) {
      const finalFilteredData = filterKeys.reduce((result, key) => {
        const filteredDataResult = result.filter((row) =>{
          if(filterKeys.includes(key)){
            console.log(filterState[key])
            if(filterState[key] === 'all'){
              return row.status !== 'deleted'
            }else if (filterState['status'] === 'deleted') {
                if(filterState['softwareType'] && row.status === 'deleted'){
                return row[key] === filterState[key]
            }
            if(filterState['billingCycle'] && row.status === 'deleted'){
              return row[key] === filterState[key]
          }
              return  row.status === 'deleted'
            }
            else if (filterState['status'] === 'expired') {
               if(row.status !=="deleted"){
              const todaysDate = moment().format('YYYY-MM-DD');
              const days = moment(row.nextBilling, 'YYYY-MM-DD').diff(
                moment(todaysDate),
                'days'
              );
              if(days<0){
                    if(key === 'softwareType'){
                      console.log("k*****y",key)
                      return row['softwareType'] === filterState['softwareType']
                  }
                  if(key==='billingCycle'){
                    console.log("key",row)
                    return row['billingCycle'] === filterState['billingCycle']
                }
                    return row
          }
        }
      }
            else{
              return row[key] === filterState[key] && row.status !== 'deleted'
              }
           
          }
        }
    
        );
        result = [...filteredDataResult];
        return result;
      }, data);
      if(finalFilteredData.length > 0){
        setNoRecords(false);
      }else{
        setNoRecords(true);
      }
      setFilteredData(addSerialNo(finalFilteredData));
    }
  };
  
  return (
    <>
      <div className='filter-row'>
        <p>
          {
            "Here's one tool for all Evoke's licenses! eSoft helps maintain Certificates, Domains & Software licenses with ease."
          }
          <br />
          {
            'It helps reduce reparative documentation efforts, optimize usage, & control costs.'
          }
          <br />
        </p>
        <div className='row'>
          <GlobalFilter
            setFilter={(value) => {
              setGlobalFilter(value);
              setSearchValue(value);
              setSearchText('')
            }}
            removeSearchValue={emptySearch}
          />
        </div>
      </div>
      {isModalOpen && (
        <div>
          <Modal
            centered
            backdrop='static'
            show={isModalOpen}
            onHide={(e) => setIsModalOpen(false)}
            className='deleteModal'
          >
            <Modal.Header closeButton className='modal-area'>
              Are you sure?
            </Modal.Header>
            <Modal.Body>
              <form>
                <p>Please enter the reason to delete the record.</p>
                <textarea
                  type='text'
                  rows='3'
                  autoFocus={true}
                  style={{ color: 'black' }}
                  onChange={handleInputChange}
                  name='deleteReason'
                  value={rowData.deleteReason}
                />
                <p className='descr'>
                  Take a deep breath! Because if deleted once,it is gone
                  forever.
                </p>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  className='form-control btn cancel'
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!rowData?.deleteReason}
                  className='form-control btn btn-primary delete-btn'
                >
                  Delete
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </div>
      )}
     
      <div className='table-responsive grid tableFixHead'>
        <table {...getTableProps()} className='table table-striped '>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    key={index}
                    {...column.getHeaderProps(
                      column.getSortByToggleProps({
                        title: undefined,
                        style: {
                          minWidth: column.minWidth,
                          width: column.width,
                        },
                      })
                    )}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted &&
                        (column.isSortedDesc ? (
                          <img src={UpDownImg} alt='up' />
                        ) : (
                          <img src={UpDownImg} alt='down' />
                        ))}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {!noRecords ? page.map((row, keyValue) => {
              prepareRow(row);
              return (
                <React.Fragment key={keyValue}>
                  <tr className='text-capital' {...row.getRowProps()}>
                    {row.cells.map((cell, index) => {
                      let style = {};
                      style = { textAlign: 'left' };
                      if (cell.column.id === 'status') {
                        if (cell.value === 'Pending') {
                          style = { color: '#F16A21', textAlign: 'left' };
                        } else if (cell.value === 'Submitted') {
                          style = { color: '#0066FF', textAlign: 'left' };
                        } else if (cell.value === 'Completed') {
                          style = { color: '#13BC86', textAlign: 'left' };
                        } else if (cell.value === 'Approved') {
                          style = { color: 'green', textAlign: 'left' };
                        }
                      }
                      return (
                        <td key={index} {...cell.getCellProps({ style })}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                
                </React.Fragment>
              );
            }) : <tr style={{textAlign: 'center'}}><span>No data found</span></tr>}
          </tbody>
        </table>
        {page.length > 0 && (
          <div className='table-pagination'>
            { !noRecords && <span className='paginate'>
              <b>{start}</b> to <b>{end}</b> of <b>{filteredData.length}</b>
            </span>}
            {/* <label>Rows per page:</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className='pageNum'
        >
          {[10, 20, 50, 100].map((pageSize, i) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select> */}
            {!noRecords && <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>}
            {!noRecords && <div className='prev-next'>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <img src={leftIcon} alt='prev' />
              </button>{' '}
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                <img src={rightIcon} alt='next' />
              </button>{' '}
            </div>}
            <input className='pagination-search'
          type= 'number'
           onChange={(e) => {
            const value= e.target.value-1;
            const enteredValue = e.target.value.match(/^([1-9]\d*)?$/) && e.target.value.match(/^([1-9]\d*)?$/)['input'] ? e.target.value : ''; 
            if(pageOptions.length > value){
              gotoPage(value);
              setEnteredValue(enteredValue);
              setNoRecords(false);
            }else{
              setEnteredValue(e.target.value);
              setNoRecords(true);
            }
          } }
          value={enteredValue}
          />
          </div>
        )}
      </div>

      {isEditFormOpen && (
        <Form
          isOpen={isEditFormOpen}
          closeModal={() => {
            toggleEditForm(false);
            setRowData(null);
          }}
          rowData={rowData}
          isEdit={true}
        />
      )}
    </>
  );
}
export default UserTable;
