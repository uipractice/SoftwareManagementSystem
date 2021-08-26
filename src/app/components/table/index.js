import React, { useEffect, useState, useCallback } from 'react';
import DeleteImg from '../../assets/images/delete-icon.svg';
import EditImg from '../../assets/images/edit-icon.svg';
import UpDownImg from '../../assets/images/sorting.svg';
import AttachIcon from '../../assets/images/amount-attachment.png';
import axios from 'axios';
import Modal from 'react-modal';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useExpanded,
} from 'react-table';
import './table.css';
import GlobalFilter from './search';
import rightIcon from '../../assets/images/right-icon.svg';
import leftIcon from '../../assets/images/left-icon.svg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import Form from '../admin/Form';
import { getApiUrl } from '../utils/helper';
import FilterDropdown from './filter';
import Download from '../../assets/images/download.svg';
import Note from '../../assets/images/note.svg';

toast.configure();
function CompleteTable({ data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const [rowData, setRowData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditFormOpen, toggleEditForm] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const setDefaultFilterData = useCallback((data) => {
    if (data?.length) {
      let filterResult = data.filter((row) => row.status !== 'deleted');
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
  }, [setDefaultFilterData, data]);

  function handleInputChange(evt) {
    setRowData({
      ...rowData,
      deleteReason: evt.target.value,
    });
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
  const columns = React.useMemo(
    () => [
      {
        Header: 'SL.NO',
        accessor: 'serial',
        width: 75,
      },
      {
        Header: 'SOFTWARE',
        accessor: 'softwareName',
        sticky: 'left',
        width: 160,
        Cell: ({
          row: {
            original: { websiteUrl, softwareName },
          },
        }) => (
          <div>
            {websiteUrl ? (
              <a href={websiteUrl} target='_blank' rel='noreferrer'>
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
      },
      {
        Header: 'TEAM',
        accessor: 'team',
        sticky: 'left',
        width: 120,
      },
      {
        Header: 'USER/OWNER',
        accessor: 'owner',
        width: 150,
      },
      {
        Header: 'BILLING CYCLE',
        accessor: 'billingCycle',
        width: 130,
      },
      {
        Header: 'PRICING IN $',
        accessor: 'pricingInDollar',
        width: 125,
        Cell: ({
          row: {
            original: { billingDetails },
          },
        }) =>
          `${
            billingDetails?.length
              ? billingDetails[billingDetails.length - 1]?.pricingInDollar
              : ''
          }`,
      },
      {
        Header: 'PRICING IN ₹',
        accessor: 'pricingInRupee',
        width: 125,
        Cell: ({
          row: {
            original: { billingDetails },
          },
        }) =>
          `${
            billingDetails?.length
              ? billingDetails[billingDetails.length - 1]?.pricingInRupee
              : ''
          }`,
      },
      {
        Header: 'TOTAL IN ₹',
        accessor: 'totalAmount',
        width: 130,
        // id: "expander",
        Cell: ({
          row: {
            original: { billingDetails, billingCycle },
            getToggleRowExpandedProps,
            isExpanded,
          },
        }) => {
          const isMonthly = billingCycle === 'monthly';
          return (
            <div
              className='d-flex justify-content-end align-items-center'
              {...(isMonthly &&
                getToggleRowExpandedProps({ title: undefined }))}
            >
              <div>
                {billingDetails?.reduce(
                  (result, item) => (result += Number(item.pricingInRupee)),
                  0
                )}
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
        width: 120,
        Cell: ({
          row: {
            original: { nextBilling },
          },
        }) => moment(nextBilling).format('DD-MM-YYYY'),
      },
      {
        Header: 'TIMELINE',
        accessor: 'timeline',
        width: 100,
        Cell: ({
          row: {
            original: { nextBilling },
          },
        }) => {
          const days = moment(nextBilling).diff(moment(), 'days');
          return (
            <div
              className={`timeline ${
                days >= 10
                  ? `timelineGreen`
                  : days > 7
                  ? `timelineYellow`
                  : `timelineRed`
              }`}
            >
              <p>
                {days === 0
                  ? `Today`
                  : days < 0
                  ? `Expired`
                  : `${days} day${days === 1 ? '' : 's'}`}
              </p>
            </div>
          );
        },
      },
      {
        Header: 'ACTION',
        width: 100,
        Cell: ({ row }) => (
          <div>
            <img
              className='p-2 pointer'
              src={EditImg}
              alt='Evoke Technologies'
              onClick={() => {
                setRowData(row.original);
                toggleEditForm(true);
              }}
            />
            <img
              className={`p-2 pointer ${
                row.original.status === 'deleted' && 'disableDeleteBtn'
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
  const downloadInvoice = useCallback(
    ({ original: rowItemData }, billingItem) => {
      axios
        .get(
          getApiUrl(
            `softwareInfo/download/${rowItemData._id}/${billingItem._id}`
          )
        )
        .then((res) => {
          const files = res.data;
          downloadFiles(files, billingItem.invoiceFiles);
        });
    },
    []
  );

  const renderRowSubComponent = useCallback(
    ({ row }) => (
      <td colSpan='12' className='rowexpandable'>
        <div className='subscrit'>
          <h3 className='rowexpandfont'>Subscription for :</h3>
          {row.original.billingDetails.map((item, i) => (
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
              <div className='amount'>
                {`₹${item.pricingInRupee} `}
                {item.invoiceFiles.length > 0 && (
                  <img
                    className='pl-3 pr-2 pointer'
                    src={Download}
                    onClick={() => downloadInvoice(row, item)}
                    alt='download'
                  />
                )}
                <img src={AttachIcon} alt='Attachment Icon' />
              </div>
            </div>
          ))}
          <button onClick={handleShow}>Show All</button>
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
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    prepareRow,
    state,
    setGlobalFilter,
    rows: filteredTableData,
  } = useTable(
    { columns, data: filteredData, initialState: { pageSize: 7 } },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  );
  const { globalFilter, pageIndex, pageSize } = state;
  useEffect(() => {
    if (filteredTableData?.length && globalFilter && searchValue)
      setFilteredData(addSerialNo(filteredTableData, true));
    else if (searchValue === '') setFilteredData(addSerialNo(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const onFilterSelect = (filterState) => {
    const filterKeys = Object.keys(filterState);
    if (filterKeys?.length) {
      const finalFilteredData = filterKeys.reduce((result, key) => {
        const filteredData = result.filter((row) =>
          key === 'all'
            ? row.status !== 'deleted'
            : filterKeys.includes('status')
            ? row[key] === filterState[key]
            : row[key] === filterState[key] && row.status !== 'deleted'
        );
        result = [...filteredData];
        return result;
      }, data);
      setFilteredData(addSerialNo(finalFilteredData));
    }
  };
  return (
    <>
      <div className='filter-row'>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eros leo
          suscipit ipsum id ut. <br />
          Et consectetur convallis etiam auctor ut orci. Sed id ac quis
          tristique vehicula.
          <br />
          Leo magna posuere pellentesque malesuada.
        </p>

        <div className='row'>
          <FilterDropdown
            filterSelect={(selectedState) => onFilterSelect(selectedState)}
          />
          <GlobalFilter
            setFilter={(value) => {
              setGlobalFilter(value);
              setSearchValue(value);
            }}
          />
        </div>
      </div>
      <div>
        <Modal
          isOpen={isModalOpen}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => {
            setIsModalOpen(false);
          }}
          className='modalDesign deleteModal'
        >
          <h2>Are you sure?</h2>
          <button
            className='_modal-close'
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <svg className='_modal-close-icon' viewBox='0 0 40 40'>
              <path d='M 10,10 L 30,30 M 30,10 L 10,30' />
            </svg>
          </button>
          <form>
            <p>Please enter the reason to delete the record.</p>
            <textarea
              type='text'
              autoFocus={true}
              style={{ color: 'black' }}
              onChange={handleInputChange}
              name='deleteReason'
            />
            <br></br>
            <p className='descr'>
              {' '}
              Do you really want to delete the records? This process cannot be
              undone.
            </p>
            <br></br>
            <div className='row'>
              <div className='col-md-6 text-right padding0'>
                <button
                  className='form-control btn btn-primary'
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className='col-md-6'>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!rowData?.deleteReason}
                  className='form-control btn btn-primary delete-btn'
                >
                  Delete
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
      <div>
        <Modal isOpen={show} onHide={handleClose} className='carendar-modal'>
          <h2>Subscription Detail</h2>
          <button className='_modal-close' onClick={handleClose}>
            <svg className='_modal-close-icon' viewBox='0 0 40 40'>
              <path d='M 10,10 L 30,30 M 30,10 L 10,30' />
            </svg>
          </button>
          <div className='modalBody'>
            <h3>Browser Stack</h3>
            <div className='calenderGrid'>
              <div>Jan</div>
              <div>
                Feb
                <div className='amount'>
                  70$
                  <img src={AttachIcon} alt='Attachment Icon' />
                </div>
              </div>
              <div>Mar</div>
              <div>Apr</div>
              <div>May</div>
              <div>June</div>
              <div>July</div>
              <div>Aug</div>
              <div>Sept</div>
              <div>Oct</div>
              <div>Nov</div>
              <div>Dec</div>
            </div>
            <p>Totla Amount: 60000</p>
          </div>
        </Modal>
      </div>
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
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <React.Fragment key={index}>
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
            })}
          </tbody>
        </table>
      </div>
      <div className='table-pagination'>
        <label>Rows per page:</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className='pageNum'
        >
          {[7, 10, 20, 50, 100].map((pageSize, i) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <div className='prev-next'>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <img src={leftIcon} alt='prev' />
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <img src={rightIcon} alt='next' />
          </button>{' '}
        </div>
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
export default CompleteTable;
