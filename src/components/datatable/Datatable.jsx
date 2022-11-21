import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const Datatable = ({ columns }) => {
  console.log("Datatable...");

  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const [list, setList] = useState();

  // /uers, /hotels, /room 루트 이름에 따라 path로 동적으로 get 요청
  const { data, loading, error } = useFetch(`http://localhost:8800/${path}`);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/${path}/${id}`, {
        withCredentials: true,
      });
      setList(list.filter((item) => item._id !== id));
    } catch (error) {}
  };

  useEffect(() => {
    setList(data);
  }, [data]);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">보기</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              삭제
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      {list ? (
        <DataGrid
          className="datagrid"
          rows={list}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      ) : null}
    </div>
  );
};

export default Datatable;
