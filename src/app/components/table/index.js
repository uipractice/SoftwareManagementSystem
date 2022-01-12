import React, { useEffect, useState, useCallback } from 'react';
import DeleteImg from '../../assets/images/delete-icon.svg';
import Renew from '../../assets/images/Renew.png';
import UpDownImg from '../../assets/images/sorting.svg';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useExpanded,
} from 'react-table';
import './table.css';
import GlobalFilter from './GlobalFilter';
import rightIcon from '../../assets/images/right-icon.svg';
import leftIcon from '../../assets/images/left-icon.svg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment, { monthsShort } from 'moment';
import Form from '../admin/Form';
import { getApiUrl } from '../utils/helper';
import FilterDropdown from './FilterDropdown';
import Download from '../../assets/images/download.svg';
import Note from '../../assets/images/note.svg';

import { guest, superAdmin } from '../constants/constants';
import { getUser } from '../utils/userDetails';

toast.configure();
function CompleteTable({ data, sortByDateCreated,getAddToolStatus }) {
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const [rowData, setRowData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditFormOpen, toggleEditForm] = useState(false);
  const [show, setShow] = useState(false);
  const [noRecords, setNoRecords] = useState(false);

  const [enteredValue, setEnteredValue] = useState('');
  const [emptySearch, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState({});
  const updateSatus=(value)=>{
    getAddToolStatus(value)
    
  }
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
  }, [setDefaultFilterData, data, sortByDateCreated]);

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
      .post(getApiUrl(`softwareInfo/update/${id}`), rowData)
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
  const customSorting = (c1, c2, header) => {
    if (header === 'TIMELINE') {
      if (c1 === c2) {
        return 0;
      } else if (c1 < 0) {
        return 1;
      } else if (c2 < 0) {
        return -1;
      } else if (c1 < c2) {
        return -1;
      }
    } else {
      if (c1 !== undefined && c2 !== undefined)
        return c1.localeCompare(c2, undefined, { numeric: true });
    }
  };
  const getTimeLineClass = (days) => {
    return days >= 7 ? 'timelineYellow' : 'timelineRed';
  };
  const getExpiredDays = (days) => {
    return days === 1 ? '' : 's';
  };
  const getExpiredText = (days) => {
    return days < 0 ? `Expired` : `${days} day${getExpiredDays(days)}`;
  };
  const columns = React.useMemo(
    () => [
      {
        Header: 'Date Created',
        accessor: 'createdAt',
        width: 10,
        isVisible: 'false',
      },
      {
        Header: 'SOFTWARE',
        accessor: 'softwareName',
        sticky: 'left',
        width: 170,
        sortType: (a, b) => {
          return customSorting(
            a.original.softwareName,
            b.original.softwareName
          );
        },
        Cell: ({
          row: {
            original: { websiteUrl, softwareName },
          },
        }) => (
          <div
            className='ellipse-css'
            title={softwareName}
            style={{
              pointerEvents:
                JSON.parse(getUser()).role === guest ? 'none' : 'cursor',
            }}
          >
            {websiteUrl ? (
              <a
                href={websiteUrl}
                target='_blank'
                rel='noreferrer'
                title={softwareName}
              >
                {softwareName}
              </a>
            ) : (
              softwareName
            )}
          </div>
        ),
      },
      {
        Header: 'TYPE',
        accessor: 'softwareType',
        sticky: 'left',
        width: 120,
        sortType: (a, b) => {
          return customSorting(
            a.original.softwareType,
            b.original.softwareType
          );
        },
      },
      {
        Header: 'TEAM',
        accessor: 'team',
        sticky: 'left',
        width: 120,
        sortType: (a, b) => {
          return customSorting(a.original.team, b.original.team);
        },
      },
      {
        Header: 'USER/OWNER',
        accessor: 'owner',
        width: 150,
        sortType: (a, b) => {
          return customSorting(a.original.owner, b.original.owner);
        },
      },
      {
        Header: 'BILLING CYCLE',
        accessor: 'billingCycle',
        width: 130,
        sortType: (a, b) => {
          return customSorting(
            a.original.billingCycle,
            b.original.billingCycle
          );
        },
      },
      {
        Header: 'PRICING IN $',
        accessor: 'pricingInDollar',
        width: 125,
        // sortType: (a, b) => {
        //   return customSorting(
        //     a.original.billingDetails[0].pricingInDollar.toString(),
        //     b.original.billingDetails[0].pricingInDollar.toString()
        //   );
        // }
        //,
        Cell: ({
          row: {
            original: { billingDetails },
          },
        }) =>
          `${Object.keys(billingDetails)
            .slice(0, 1)
            .map((item, ind) => {
              return billingDetails[item][0].pricingInDollar
                ? parseFloat(billingDetails[item][0].pricingInDollar).toFixed(2)
                : Number(0).toFixed(2);
            })}`,
      },
      {
        Header: 'PRICING IN ₹',
        accessor: 'pricingInRupee',
        width: 125,
        // sortType: (a, b) => {
        //   return customSorting(
        //     a.original.billingDetails[0].pricingInRupee.toString(),
        //     b.original.billingDetails[0].pricingInRupee.toString()
        //   );
        // },
        Cell: ({
          row: {
            original: { billingDetails },
          },
        }) =>
          `${Object.keys(billingDetails)
            .slice(0, 1)
            .map((item, ind) => {
              return billingDetails[item][0].pricingInRupee
                ? parseFloat(billingDetails[item][0].pricingInRupee).toFixed(2)
                : Number(0).toFixed(2);
            })}`,
      },
      {
        Header: 'TOTAL IN ₹',
        accessor: (originalRow) => {
      
          let amount = Object.keys(originalRow.billingDetails).map(
            (item, index) => {
              return originalRow.billingDetails[item].reduce(
                (previousVal, currentVal) => {
                  return (
                    Number(previousVal) + Number(currentVal.pricingInRupee)
                  );
                },
                0
              );
            }
          );
          return amount.reduce((previousVal, price) => {
            return previousVal + price;
          }, 0);
        },
        width: 130,
        sortType: (a, b) => {
          return customSorting(
            a.values['TOTAL IN ₹'].toString(),
            b.values['TOTAL IN ₹'].toString()
          );
        },
        // id: "expander",
        Cell: ({
          row: {
            original: { billingDetails, billingCycle },
            getToggleRowExpandedProps,
            isExpanded,
          },
        }) => {
          const isMonthly = billingCycle === 'monthly';
          let subscriptionPrice = Object.keys(billingDetails).map(
            (item, index) => {
              return billingDetails[item].reduce((previousVal, currentVal) => {
                return Number(previousVal) + Number(currentVal.pricingInRupee);
              }, 0);
            }
          );
          let totalSubsricptionPrice = subscriptionPrice.reduce(
            (previousVal, price) => {
              return previousVal + price;
            },
            0
          );
          return (
            <div
              className='d-flex justify-content-end align-items-center'
              {...(isMonthly &&
                getToggleRowExpandedProps({ title: undefined }))}
            >
              <div>
                {totalSubsricptionPrice}
                &nbsp;&nbsp;
              </div>
              {isMonthly && (
                <div
                  className={`arrow ${
                    isExpanded ? 'arrow-bottom' : 'arrow-right'
                  }`}
                />
              )}
            </div>
          );
        },
      },
      {
        Header: 'NEXT BILLING',
        accessor: 'nextBilling',
        width: 130,
        sortType: (a, b) => {
          return customSorting(a.original.nextBilling, b.original.nextBilling);
        },
        Cell: ({
          row: {
            original: { nextBilling },
          },
        }) => moment(nextBilling).format('DD-MM-YYYY'),
      },
      {
        Header: 'TIMELINE',
        accessor: (originalRow) => {
          const todaysDate = moment().format('YYYY-MM-DD');
          return moment(originalRow.nextBilling, 'YYYY-MM-DD').diff(
            moment(todaysDate),
            'days'
          );

          // return days ;
        },
        width: 100,
        sortType: (a, b) => {
          return customSorting(
            a.values.TIMELINE,
            b.values.TIMELINE,
            'TIMELINE'
          );
        },

        Cell: ({
          row: {
            original: { nextBilling },
          },
        }) => {
          const todaysDate = moment().format('YYYY-MM-DD');
          const days = moment(nextBilling, 'YYYY-MM-DD').diff(
            moment(todaysDate),
            'days'
          );
          return (
            <div
              className={`timeline ${
                days >= 10 ? 'timelineGreen' : getTimeLineClass(days)
              }`}
            >
              <p>{days === 0 ? `Today` : getExpiredText(days)}</p>
            </div>
          );
        },
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        width: 100,
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
                setRowData(row.original);
                toggleEditForm(true);
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

  // Get S3 signed urls of the attachments for a Billing Month.
  const downloadInvoice = useCallback((rowItemData, billingItem) => {
    axios
      .get(
        getApiUrl(`softwareInfo/download/${rowItemData._id}/${billingItem._id}`)
      )
      .then((res) => {
        const files = res.data;
        downloadFiles(files, billingItem.invoiceFiles);
      });
  }, []);
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];
  const renderRowSubComponent = useCallback(
    ({ row }) => (
      
      <td colSpan='12' className='rowexpandable'>
        <div className='subscrit'>
          <h3 className='rowexpandfont'>Subscription for:</h3>
      
          {
             Object.keys(row.original.billingDetails).map((item, index) => {
              return row.original.billingDetails[item]
              .sort((a,b)=>
              months.indexOf(a.billingMonth) > months.indexOf(b.billingMonth)?1:a.billingMonth === b.billingMonth?0:-1
              )
              .map((month, ind) => (
                 <div key={ind} className='label text-capitalize'>
                  <label>
                    {month.billingMonth}{'-'}{item.substring(2,4)}{' '}
                    {month.description && (
                      <img
                        className='px-2 pointer'
                        src={Note}
                        title={month.description}
                        alt='description'
                      />
                    )}{' '}
                  </label>
                  <div className='amount'>
                    {month.pricingInRupee!==''?`${'₹'}${parseFloat(month.pricingInRupee).toFixed(2)}`:`${'₹'}${Number(0).toFixed(2)}`}
                    {month.invoiceFiles?.length > 0 && (
                      <img
                        className='pl-3 pr-2 pointer'
                        src={Download}
                        onClick={() => downloadInvoice(row.original, item)}
                        alt='download'
                      />
                   )}
                  </div>
                </div>
               )
              );
            })

          }
          {
            //  let count = Object.values(row.original.billingDetails).reduce((previousVal,currentVal)=>Number(pre)+cur.length,0);
          // row.original.billingDetails?.length > 6 && (
          //   <div style={{ alignSelf: 'flex-end', margin: '18px 0' }}>
          //     <button
          //       onClick={() => {
          //         setShow(true);
          //         setRowData(row.original);
          //       }}
          //     >
          //       Show All
          //     </button>
          //   </div>
          // )
          }
        </div>
      </td>
    ),
    [downloadInvoice]
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
        autoResetSortBy: false,
        manualSortBy: true,
        hiddenColumns: [
          'createdAt',
          JSON.parse(getUser()).role === guest ? ['action'] : [''],
        ],
        sortBy: [
          {
            id: sortByDateCreated === false ? 'billingCycle' : 'createdAt',
            desc: sortByDateCreated === false ? false : true,
          },
          {
            id: sortByDateCreated === false ? 'TIMELINE' : 'createdAt',
            desc: sortByDateCreated === false ? false : true,
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
    if (filteredTableData?.length && globalFilter && searchValue) {
      setFilteredData(addSerialNo(filteredTableData, true));
      setEnteredValue('');
      setNoRecords(false);
    } else if (searchValue === '') {
      setFilteredData(addSerialNo(data));
      onFilterSelect(selectedFilter);
      setEnteredValue('');
      setNoRecords(false);
    }
    if (filteredTableData.length === 0 && searchValue) {
      setNoRecords(true);
    } else {
      setNoRecords(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const onFilterSelect = (filterState) => {
    setSelectedFilter(filterState);
    setSearchText('empty');
    const filterKeys = Object.keys(filterState);

    if (filterKeys?.length) {
      const finalFilteredData = filterKeys.reduce((result, key) => {
        const filteredDataResult = result.filter((row) => {
          if (filterKeys.includes(key)) {
            console.log(filterState[key]);
            if (filterState[key] === 'all') {
              return row.status !== 'deleted';
            } else if (filterState['status'] === 'deleted') {
              if (filterState['softwareType'] && row.status === 'deleted') {
                return row[key] === filterState[key];
              }
              if (filterState['billingCycle'] && row.status === 'deleted') {
                return row[key] === filterState[key];
              }
              return row.status === 'deleted';
            } else if (filterState['status'] === 'expired') {
              if (row.status !== 'deleted') {
                const todaysDate = moment().format('YYYY-MM-DD');
                const days = moment(row.nextBilling, 'YYYY-MM-DD').diff(
                  moment(todaysDate),
                  'days'
                );
                if (days < 0) {
                  if (key === 'softwareType') {
                    console.log('k*****y', key);
                    return row['softwareType'] === filterState['softwareType'];
                  }
                  if (key === 'billingCycle') {
                    console.log('key', row);
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
      if (finalFilteredData.length > 0) {
        setNoRecords(false);
      } else {
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
          <FilterDropdown
            filterSelect={(selectedState) => onFilterSelect(selectedState)}
          />
          <GlobalFilter
            setFilter={(value) => {
              setGlobalFilter(value);
              setSearchValue(value);
              setSearchText('');
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
      {show && (
        <div>
          <Modal
            centered
            size='lg'
            show={show}
            backdrop='static'
            className='subscriptionModal'
            onHide={() => setShow(false)}
          >
            <Modal.Header closeButton className='modal-area'>
              <h3>Subscription Details</h3>
            </Modal.Header>
            <Modal.Body className='rowexpandfont'>
              <div className='d-flex justify-content-between px-1'>
                <div>{rowData.softwareName}</div>
                <div className='prev-next'>
                  <button disabled={!canPreviousPage}>
                    <img src={leftIcon} alt='prev' />
                  </button>{' '}
                  {moment(rowData.createdAt).format('YYYY')}{' '}
                  <button disabled={!canNextPage}>
                    <img src={rightIcon} alt='next' />
                  </button>{' '}
                </div>
              </div>
              <div className='calenderGrid'>
                {months.map((month) => {
                  const billingItem =
                    rowData.billingDetails?.filter(
                      (item) => item.billingMonth === month
                    ) || [];
                  return (
                    <div
                      key={month}
                      className='calenderGridItem text-capitalize'
                    >
                      {month}
                      {billingItem?.length !== 0 && (
                        <div className='amount'>
                          <span>{`₹${billingItem[0]?.pricingInRupee}`}</span>
                          {billingItem[0].invoiceFiles.length > 0 && (
                            <img
                              src={Download}
                              // src={AttachIcon}
                              onClick={() =>
                                downloadInvoice(rowData, billingItem[0])
                              }
                              alt='download'
                              className='pointer px-1'
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div>
                <span>
                  {'Total Amount:  ₹'}
                  {rowData.billingDetails?.reduce(
                    (result, item) => Number(item.pricingInRupee) + result,
                    0
                  )}
                </span>
              </div>
            </Modal.Body>
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
            {!noRecords ? (
              page.map((row, keyValue) => {
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
                    {row.isExpanded ? (
                      <tr>
                        {/* <td colSpan={visibleColumns.length}></td> */}
                        {renderRowSubComponent({ row })}
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })
            ) : (
              <tr style={{ textAlign: 'center' }}>
                <span>No data found</span>
              </tr>
            )}
          </tbody>
        </table>
        {page.length > 0 && (
          <div className='table-pagination'>
            {!noRecords && (
              <span className='paginate'>
                <b>{start}</b> to <b>{end}</b> of <b>{filteredData.length}</b>
              </span>
            )}
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
            {!noRecords && (
              <span>
                Page{' '}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
              </span>
            )}
            {!noRecords && (
              <div className='prev-next'>
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <img src={leftIcon} alt='prev' />
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  <img src={rightIcon} alt='next' />
                </button>{' '}
              </div>
            )}
            <input
              className='pagination-search'
              type='number'
              onChange={(e) => {
                const value = e.target.value - 1;
                const enteredValue =
                  e.target.value.match(/^([1-9]\d*)?$/) &&
                  e.target.value.match(/^([1-9]\d*)?$/)['input']
                    ? e.target.value
                    : '';
                if (pageOptions.length > value) {
                  gotoPage(value);
                  setEnteredValue(enteredValue);
                  setNoRecords(false);
                } else {
                  setEnteredValue(e.target.value);
                  setNoRecords(true);
                }
              }}
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
          updateToolStatus={updateSatus}
        />
      )}
    </>
  );
}
export default CompleteTable;
