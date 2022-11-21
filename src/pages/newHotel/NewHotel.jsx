import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewHotel = () => {
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);

  const { data, loading, error } = useFetch("http://localhost:8800/rooms");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // console.log("info: ", info);

  const handleSelect = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setRooms(value);
  };

  // console.log("files: ", files);
  // console.log("Array.isArray(files): ", Array.isArray(files));
  // const f = Object.values(files);
  // console.log("Object.values(files): ", f);
  // console.log("Array.isArray(Object.values(files)): ", Array.isArray(f));

  const handleClick = async (e) => {
    e.preventDefault();

    // .env에서 할당한 환경변수 값을 가져옴 (CRA 기준 환경변수명)
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;

    try {
      const list = await Promise.all(
        Object.values(files).map(async (file) => {
          const data = new FormData();

          // Required parameters for unauthenticated requests:
          data.append("file", file);
          data.append("upload_preset", uploadPreset);

          const uploadRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            data
          );

          const { url } = uploadRes.data;

          return url;
        })
      );

      const newHotel = {
        ...info,
        rooms,
        photos: list,
      };

      console.log("newHotel: ", newHotel);

      await axios.post("http://localhost:8800/hotels", newHotel, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Featured</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="selectRooms">
                <label>Rooms</label>
                <select id="rooms" multiple onChange={handleSelect}>
                  {loading
                    ? "Loading"
                    : data.length > 0 &&
                      data.map((room) => (
                        <option value={room._id} key={room._id}>
                          {room.title}
                        </option>
                      ))}
                </select>
              </div>

              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
