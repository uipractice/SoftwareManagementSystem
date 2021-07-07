import React, { useState } from "react";
import DeleteImg from "../../assets/images/delete.svg";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { format } from "date-fns";
import "./table.css";
import GlobalFilter from "./GlobalFilter";

import rightIcon from "../../assets/images/right-icon.svg";
import leftIcon from "../../assets/images/left-icon.svg";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

Modal.setAppElement("#root");
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
function CompleteTable({ data }) {

  const [rowOriginal, setRowOriginal] = useState({});
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const classes = useStyles();
  const [age, setAge] = React.useState('');
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  function handleInputChange(evt) {
    setRowOriginal({
      ...rowOriginal,
      deleteReason: evt.target.value,
    });
  }

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    rowOriginal.status = "Deleted";
    const id = rowOriginal._id;
    axios
      .post("http://localhost:5000/clientInfo/deleteStatus/" + id, rowOriginal)
      .then((res) => {
        toast.warn("Record has been marked DELETED !", {
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
        Header: "SL.NO",
        accessor: "serial",
        // filterable: false,
      },

      {
        Header: "PROJECT NAME",
        accessor: "projectNameByIT",
        Cell: ({ row }) => {
          return (
            
              
              <Link
                to={{
                  pathname: `/formv/${row.original._id}`,
                  state: {
                    projectNameByIT: row.original.projectNameByIT,
                    projectManager: row.original.projectManager,
                    email: row.original.email,
                    practice: row.original.practice,
                    status: row.original.status,
                    id: row.original._id,

                    projectName: row.original.projectName,
                    securityMeasure: row.original.securityMeasure,
                    informIT: row.original.informIT,
                    workStationSelected: row.original.workStationSelected,
                    devTypeSelected: row.original.devTypeSelected,
                    allowedWebsite: row.original.allowedWebsite,
                    isNDAsigned: row.original.isNDAsigned,
                    isGDPRcompliance: row.original.isGDPRcompliance,
                    isCyberSecConducted: row.original.isCyberSecConducted,
                    securityBreach: row.original.securityBreach,
                    isDisasterInsuCovered: row.original.isDisasterInsuCovered,
                    disasterDetails: row.original.disasterDetails,
                    showInsuranceDetails: row.original.showInsuranceDetails,
                    isIsolatedEnvReq: row.original.isIsolatedEnvReq,
                    isolationDetails: row.original.isolationDetails,
                    showIsolatedDetails: row.original.showIsolatedDetails,
                    isDLPreq: row.original.isDLPreq,
                    isClientEmailProvided: row.original.isClientEmailProvided,
                    deleteReason: row.original.deleteReason,
                    reshareReason: row.original.reshareReason,
                  },
                }}
              >
                {row.original.projectNameByIT}
              </Link>
 
           
          );
        },
        sticky: "left",
      },
      {
        Header: "PROJECT MANAGER",
        accessor: "projectManager",
        sticky: "left",
      },
      {
        Header: "PRACTICE NAME",
        accessor: "practice",
        sticky: "left",
      },
      {
        Header: "ASSIGN DATE",
        accessor: "createdAt",
        Cell: ({ value }) => {
          return format(new Date(value), "dd/MM/yyyy");
        },
        maxWidth: 200,
        minWidth: 80,
        width: 100,
      },
      {
        Header: "UPDATED DATE",
        accessor: "updatedAt",
        Cell: ({ value }) => {
          return format(new Date(value), "dd/MM/yyyy");
        },
      },
      {
        Header: "STATUS",
        accessor: "status",
      },
      {
        Header: "ACTION",
        Cell: ({ row }) => (
          <a
            {...(row.original.status === "Deleted" || row.original.status === "Pending" 
              ? { className: "delete-icon disableDeleteBtn" }
              : { className: "delete-icon " })}
            onClick={(e) => {
              setRowOriginal(row.original);
              setIsModalOpen(true);
            }}
          >
            <img src={DeleteImg} alt="Evoke Technologies" />
          </a>
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
  } = useTable({ columns, data , initialState: { pageSize: 8 }}, useGlobalFilter, useSortBy, usePagination);

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <br></br>
      <div className="filter-row">
        <h5>PROJECTS DETAILS</h5>
        <div >
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          
{/* FIXME: */}
          {/* <select name="hall" id="hall" style={{ marginLeft: "12px" }}>
            <option> All Records </option>
            <option> Pending </option>
            <option> Completed </option>
            <option> Submitted </option>
            <option> Active </option>
            <option> Deleted </option>
          </select> */} 
          <FormControl className={classes.formControl}>
            <Select
              value={age}
              onChange={handleChange}
              displayEmpty
              className={classes.selectEmpty}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="" disabled>
              All Records
              </MenuItem>
              <MenuItem value={10}>Pending</MenuItem>
              <MenuItem value={20}>Completed</MenuItem>
              <MenuItem value={30}>Submitted</MenuItem>
              <MenuItem value={40}>Active</MenuItem>
              <MenuItem value={50}>Deleted</MenuItem>
            </Select>
          </FormControl>

        </div>
      </div>

      <div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => {
            setIsModalOpen(false);
          }}
          className="modalDesign deleteModal"
        >
          <h2>Are you sure?</h2>
          <button
            className="_modal-close"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <svg className="_modal-close-icon" viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button>
          <form>
            <p>Please enter the reason to delete the record.</p>
            <textarea
              type="text"
              autoFocus={true}
              style={{ color: "black" }}
              onChange={handleInputChange}
              name="deleteReason"
            />
            <br></br>
            <p className="descr">
              {" "}
              Do you really want to delete the records? This process cannot be
              undone.
            </p>
            <br></br>

            <div className="row">
              <div className="col-md-6 text-right padding0">
                <button
                  className="form-control btn btn-primary"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className="col-md-6">
                {rowOriginal.deleteReason ? (
                  <button
                    onClick={handleUpdateStatus}
                    className="form-control btn btn-primary delete-btn"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    className="form-control btn btn-primary delete-btn"
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

      <div className="table-responsive grid tableFixHead">
        <table {...getTableProps()} className="table table-striped ">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
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
                    style = { textAlign: "left" };
                    if (cell.column.id === "status") {
                      if (cell.value === "Pending") {
                        style = { color: "#F16A21", textAlign: "left" };
                      } else if (cell.value === "Submitted") {
                        style = { color: "#0066FF", textAlign: "left" };
                      } else if (cell.value === "Completed") {
                        style = { color: "#13BC86", textAlign: "left" };
                      } else if (cell.value === "Approved") {
                        style = { color: "green", textAlign: "left" };
                      }
                    }
                    return (
                      <td {...cell.getCellProps({ style })}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="table-pagination">
        <label>Rows per page:</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="pageNum"
        >
          {[8, 15, 25, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <div className="prev-next">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <img src={leftIcon} alt="prev" />
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <img src={rightIcon} alt="next" />
          </button>{" "}
        </div>
      </div>
    </>
  );
}

export default CompleteTable;
