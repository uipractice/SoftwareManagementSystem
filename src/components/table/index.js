import React, { useState } from 'react';
import DeleteImg from '../../assets/images/delete-icon.svg';
import EditImg from '../../assets/images/edit-icon.svg';
import axios from 'axios';
import Modal from 'react-modal';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from 'react-table';
import './table.css';
import GlobalFilter from './filter';
import rightIcon from '../../assets/images/right-icon.svg';
import leftIcon from '../../assets/images/left-icon.svg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

toast.configure();

function CompleteTable({ data }) {
  const [rowOriginal, setRowOriginal] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleInputChange(evt) {
    setRowOriginal({
      ...rowOriginal,
      deleteReason: evt.target.value,
    });
  }

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    rowOriginal.status = 'Deleted';
    const id = rowOriginal._id;
    axios
      .post(
        'http://localhost:5000/softwareInfo/deleteStatus/' + id,
        rowOriginal
      )
      .then((res) => {
        toast.warn('Record has been marked DELETED !', {
          autoClose: 2900,
        });
        setIsModalOpen(false);
        console.log(res.data);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((err) => console.log(err.response));
  };

  data.forEach((value, index) => {
    value.serial = index + 1;
  });

  const columns = React.useMemo(
    () => [
      {
        Header: 'SL.NO',
        accessor: 'serial',
        // filterable: false,
      },

      {
        Header: 'SOFTWARE',
        accessor: 'softwareName',
        sticky: 'left',
      },
      {
        Header: 'TYPE',
        accessor: 'type',
        sticky: 'left',
      },
      {
        Header: 'TEAM',
        accessor: 'teamName',
        sticky: 'left',
      },
      {
        Header: 'USER/OWNER',
        accessor: 'owner',
      },
      {
        Header: 'BILLIG CYCLE',
        accessor: 'billingCycle',
      },
      {
        Header: 'PRICING IN $',
        accessor: 'pricingInDollar',
      },
      {
        Header: 'PRICING IN ₹',
        accessor: 'pricingInRupee',
      },
      {
        Header: 'AMOUNT IN ₹',
        accessor: 'totalAmount',
      },
      {
        Header: 'NEXT BILLING',
        accessor: 'nextBilling',
        Cell: ({
          row: {
            original: { nextBilling },
          },
        }) => moment(nextBilling).format('DD-MM-YYYY'),
      },
      {
        Header: 'TIMELINE',
        accessor: 'timeline',
        Cell: ({
          row: {
            original: { nextBilling },
          },
        }) => {
          const days = moment(nextBilling).diff(moment(), 'days');
          return (
            <div
              className={`timeline ${
                days >= 20
                  ? `timelineGreen`
                  : days >= 5
                  ? `timelineYellow`
                  : `timelineRed`
              }`}
            >
              <p>
                {days === 0 ? `Today` : days < 0 ? `Expired` : `${days} days`}
              </p>
            </div>
          );
        },
      },
      {
        Header: 'ACTION',
        Cell: ({ row }) => (
          <div>
            <img src={EditImg} alt='Evoke Technologies' />
            <a
              {...(row.original.status === 'Deleted' ||
              row.original.status === 'Pending'
                ? { className: 'delete-icon disableDeleteBtn' }
                : { className: 'delete-icon ' })}
              onClick={() => {
                setRowOriginal(row.original);
                setIsModalOpen(true);
              }}
            >
              {' '}
              <img src={DeleteImg} alt='Evoke Technologies' />
            </a>
          </div>
        ),
      },
    ],
    []
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
  } = useTable(
    { columns, data, initialState: { pageSize: 8 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <div className='filter-row'>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eros leo
          suscipit ipsum id ut. <br />
          Et consectetur convallis etiam auctor ut orci. Sed id ac quis
          tristique vehicula.
          <br />
          Leo magna posuere pellentesque malesuada.
        </div>
        <div>
          {/* <FormControl className={classes.formControl}>
            <Select
              value={age}
              onChange={handleChange}
              displayEmpty
              className={classes.selectEmpty}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value='' disabled>
                All Records
              </MenuItem>
              <MenuItem value={10}>Pending</MenuItem>
              <MenuItem value={20}>Completed</MenuItem>
              <MenuItem value={30}>Submitted</MenuItem>
              <MenuItem value={40}>Active</MenuItem>
              <MenuItem value={50}>Deleted</MenuItem>
            </Select>
          </FormControl> */}

          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>
      </div>

      <div>
        <Modal
          isOpen={isModalOpen}
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
                {rowOriginal.deleteReason ? (
                  <button
                    onClick={handleUpdateStatus}
                    className='form-control btn btn-primary delete-btn'
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    className='form-control btn btn-primary delete-btn'
                    disabled
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </form>
        </Modal>
      </div>

      <div className='table-responsive grid tableFixHead'>
        <table {...getTableProps()} className='table table-striped '>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(
                      column.getSortByToggleProps({ title: undefined })
                    )}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
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
                      <td {...cell.getCellProps({ style })}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
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
          {[8, 10, 20, 50, 100].map((pageSize) => (
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
    </>
  );
}

export default CompleteTable;
