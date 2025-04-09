import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TABLE_DATA, TABLE_RESPONSE_MODEL, TABLE_COLUMN } from "./Model";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { getData, deleteData } from "../../../API/dataAPI";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { renderCell } from "./Helper";
import "./Table.css";
import { ToastRef, ToastSeverity } from "../Toast";
import { ERROR_MESSAGES, TOAST_SUMMARIES } from "../../Utilities/Constants";

interface FilterElement {
  value: string | null;
  matchMode: FilterMatchMode;
}

interface TableFilters {
  [key: string]: FilterElement;
}

function Table(props: TABLE_DATA) {
  const toastRef = useRef<ToastRef>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef<Toast>(null);
  const [tableData, setTableData] = useState<TABLE_RESPONSE_MODEL[]>([]);
  const [recordOffset, setRecordOffset] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);
  const [filters, setFilters] = useState<TableFilters>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const showToast = (
    title: string,
    detail?: string,
    severity?: ToastSeverity
  ) => {
    toastRef.current?.show(title, detail, severity);
  };

  useEffect(() => {
    if (props.data?.url) {
      getData(props.data?.url)
        .then((data) => {
          console.log("Data Fetched:", data);
          if (data && Array.isArray(data)) {
            setTableData(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          showToast(
            TOAST_SUMMARIES.ERROR,
            ERROR_MESSAGES.FETCH_FAILED,
            ToastSeverity.ERROR
          );
        });
    }

    // Initialize filters based on column configuration
    if (props.options?.columns) {
      const initialFilters: TableFilters = {};
      props.options.columns.forEach((col: TABLE_COLUMN) => {
        if (col.showFilter) {
          initialFilters[col.name] = {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          };
        }
      });
      setFilters(initialFilters);
    }
  }, [props.data?.url, props.options?.columns]);

  const onPageChange = (event: { first: number; rows: number }) => {
    setRecordOffset(event.first);
    setRowsPerPage(event.rows);
  };

  const getUniqueValues = (
    column: TABLE_COLUMN,
    data: TABLE_RESPONSE_MODEL[]
  ) => {
    if (!data || !data.length) return [];

    const uniqueValues = Array.from(
      new Set(
        data
          .map((item) => item[column.name])
          .filter((value) => value != null && value !== "")
      )
    ).sort();

    return uniqueValues.map((value) => ({
      label: String(value),
      value: value,
    }));
  };

  const getDropdownOptions = (column: TABLE_COLUMN) => {
    if (column.filter?.dropdownData && column.filter.dropdownData.length > 0) {
      const options = column.filter.dropdownData.map((value) => ({
        label: String(value),
        value: value,
      }));
      return options;
    }
    const options = getUniqueValues(column, tableData);
    return options;
  };

  const renderColumnFilter = (column: TABLE_COLUMN) => {
    if (!column.showFilter) return null;

    if (column.filter?.showDropdown) {
      const options = getDropdownOptions(column);

      return (
        <Dropdown
          value={filters[column.name]?.value || null}
          options={options}
          onChange={(e) => {
            const value = e.value;
            const updatedFilters: TableFilters = { ...filters };
            if (value === null) {
              delete updatedFilters[column.name];
            } else {
              updatedFilters[column.name] = {
                value,
                matchMode: FilterMatchMode.EQUALS,
              };
            }
            setFilters(updatedFilters);
          }}
          placeholder={`Select`}
          className="column-filter"
          showClear
        />
      );
    }

    return (
      <InputText
        className="column-filter"
        value={filters[column.name]?.value || ""}
        onChange={(e) => {
          const value = e.target.value;
          const updatedFilters: TableFilters = { ...filters };
          if (value === "") {
            delete updatedFilters[column.name];
          } else {
            updatedFilters[column.name] = {
              value,
              matchMode: FilterMatchMode.CONTAINS,
            };
          }
          setFilters(updatedFilters);
        }}
        placeholder={`Search`}
        style={{ width: "200px" }}
      />
    );
  };

  const renderSearch = () => {
    return (
      <div className="table-header">
        <span className="search-box">
          <InputText
            type="search"
            onInput={(e) =>
              setGlobalFilter((e.target as HTMLInputElement).value)
            }
            placeholder="Global Search"
            className="global-search"
          />
        </span>
      </div>
    );
  };

  const onEdit = (rowData: TABLE_RESPONSE_MODEL) => {
    try {
      console.log("Edit clicked for row:", rowData);
      console.log("id", rowData.id);

      // Add setTimeout before navigation
      setTimeout(() => {
        navigate(`${location.pathname}/${rowData.id}/edit`, {
          state: { rowData, returnUrl: location.pathname, id: rowData.id },
        });
      }, 1000); // 1 second delay before navigation
    } catch (error) {
      showToast(
        TOAST_SUMMARIES.ERROR,
        ERROR_MESSAGES.NAVIGATION_FAILD,
        ToastSeverity.ERROR
      );
    }
  };

  const onDelete = async (rowData: TABLE_RESPONSE_MODEL) => {
    try {
      if (window.confirm("Are you sure you want to delete this record?")) {
        if (props.data?.url && rowData.id) {
          const deleteUrl = `${props.data.url}/${rowData.id}`;
          await deleteData(deleteUrl);

          setTableData(tableData.filter((item) => item.id !== rowData.id));
        } else {
          showToast(
            TOAST_SUMMARIES.ERROR,
            ERROR_MESSAGES.NO_NAVIGATION_URL,
            ToastSeverity.ERROR
          );
        }
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const actionBodyTemplate = (rowData: TABLE_RESPONSE_MODEL) => {
    return (
      <div className="action-buttons">
        <Button
          label="Edit"
          className="edit-action"
          onClick={() => onEdit(rowData)}
        />
        <Button
          label="Delete"
          className="delete-action"
          onClick={() => onDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <div className="table-card">
        <div className="table-body">
          <DataTable
            value={tableData}
            paginator
            rows={rowsPerPage}
            first={recordOffset}
            onPage={onPageChange}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            sortMode="single"
            removableSort
            responsiveLayout="scroll"
            className="custom-datatable"
            tableStyle={{ minWidth: "100%" }}
            globalFilter={globalFilter}
            filters={filters}
            onFilter={(e) => {
              setFilters(e.filters as TableFilters);
            }}
            filterDisplay="row"
            showGridlines
            header={renderSearch()}
          >
            {props.options?.columns?.map((col: TABLE_COLUMN, index) => (
              <Column
                key={index}
                field={col.name}
                header={col.label}
                sortable={col.showSort ?? false}
                body={(rowData) => renderCell(col, rowData[col.name])}
                headerClassName="custom-header"
                className="custom-column"
                filter={col.showFilter ?? false}
                showFilterMenu={col.filter?.showMenu ?? false}
                filterElement={() => renderColumnFilter(col)}
                filterPlaceholder={`Search ${col.label}`}
              />
            ))}
            <Column
              body={actionBodyTemplate}
              header="Actions"
              style={{ width: "120px" }}
              headerClassName="custom-header"
              className="custom-column"
            />
          </DataTable>
        </div>
      </div>
    </>
  );
}

export default Table;
