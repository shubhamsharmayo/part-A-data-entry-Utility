import React from 'react'
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const TemplateList = ({ allTemplate,
  setselectedId,
  selectedId,
  settemplatename,
  templatename,
  data,
  imageNames,
  handleImageNameChange,
  UploadFile,
  imageFolder,
  csvFile,
  absentcsv,
  overallcsv,
  onCsvFileHandler,
  onAbsentCsvFileHandler,
  onOverallCsvFileHandler,
  onImageFolderHandler,
  setEditId,
  setEditModal,
  setRemoveModal,
  setRemoveId,
  onFileHeaderDetailsHandler,
  handleRollColChange,
  rollNumber }) => {
  const navigate = useNavigate();
  console.log(allTemplate)
  return (
    <div className='pt-4 xl:pt-0 bg-gradient-to-r from-blue-400 to-blue-600'>
      <div className="xl:flex justify-center items-center gap-5 mx-5 pt-10 ">
        <div className="mx-auto max-w-xs mt-5 min-h-[300px] bg-white px-8 py-4 text-center  shadow-lg rounded-3xl">
          <label className="my-5 text-[33px] font-semibold text-center text-blue-900">
            Template Name
          </label>
          <div className="form relative pb-3">
            <button className="absolute" style={{ top: "11px", left: "10px" }}>
              <svg
                className="w-5 h-5 text-gray-700"
                aria-labelledby="search"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                height="16"
                width="17"
              >
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="1.333"
                  stroke="currentColor"
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                ></path>
              </svg>
            </button>
            <input
              type="text"
              value={templatename}
              onChange={(e) => settemplatename(e.target.value)}
              required
              placeholder="Search..."
              className="input rounded-full ps-8 py-1 border-2 border-blue-500 focus:outline-none focus:border-blue-700 placeholder-gray-400"
            />
          </div>
          <div className="overflow-y-scroll h-[20vh] px-2 bg-white">
            {allTemplate?.map((template) => (
              <p
                key={template.id}
                onClick={() => setselectedId(template.id)}
                className={`group flex items-center justify-between w-full cursor-pointer mt-2 rounded-lg px-4 py-2 text-black ${selectedId === template.id ? "bg-blue-100" : ""
                  }`}
              >
                <span
                  className={`${selectedId === template.id
                    ? "text-blue-700 font-semibold text-lg hover:text-xl"
                    : "text-black hover:text-teal-700 text-md font-medium"
                    }`}
                >
                  {template.name}
                </span>
                <CiEdit
                  onClick={() => {
                    navigate(`/edittemplate/${template.id}`);
                  }}
                  className="mx-auto text-blue-600 hover:text-blue-700 text-xl cursor-pointer"
                />
                <MdDelete
                  onClick={() => {
                    setRemoveModal(true);
                    setRemoveId(template.id);
                  }}
                  className="mx-auto text-red-500 hover:text-red-600 text-xl cursor-pointer"
                />
              </p>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-center">
              <div className="rounded-sm">
                {data &&
                  <div>
                    {Array.from({ length: data.pageCount }).map((_, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          disabled={!!data?.imageColName} // Disable only if data.imageColName exists
                          type="text"
                          value={
                            imageNames[index] !== undefined
                              ? imageNames[index]
                              : data?.imageColName
                          }
                          onChange={(e) => {
                            if (!data?.imageColName) {
                              handleImageNameChange(index, e.target.value);
                            }
                          }}
                          // onChange={()=>changeHandler(index)}
                          required
                          placeholder={
                            data.pageCount === 1
                              ? "image name"
                              : `${index === 0 ? "first" : "second"} image name`
                          }
                          className="input rounded text-center text-black mb-5 py-1 border-2 border-blue-500 shadow shadow-blue-200 focus:outline-none focus:border-blue-700 placeholder-gray-400"
                        />
                      </div>
                    ))}
                    {Array.from({ length: 1 }).map((_, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          disabled={!!data?.rollNoCol} // Disable only if data.imageColName exists
                          type="text"
                          value={
                            rollNumber[index] !== undefined
                              ? rollNumber[index]
                              : data?.rollNoCol
                          }
                          onChange={(e) => {
                            if (!data?.rollNoCol) {
                              handleRollColChange(index, e.target.value);
                            }
                          }}
                          // onChange={()=>changeHandler(index)}
                          required
                          placeholder={
                            `roll No. Col`
                          }
                          className="input rounded text-center text-black mb-5 py-1 border-2 border-blue-500 shadow shadow-blue-200 focus:outline-none focus:border-blue-700 placeholder-gray-400"
                        />
                      </div>
                    ))}
                  </div>}
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-1  justify-center '>
          <div
            className=" max-w-l border-2 px-1 mt-1 text-center shadow-md pb-5"
            style={{ borderColor: "skyblue", borderRadius: "60px" }}
          >
            <img
              src={UploadFile}
              alt="uploadIcon"
              width={"10%"}
              className="mx-auto mt-5 pt-3 mb-4"
            />
            <h2 className="text-xl font-semibold text-white mb-4 mt-5">
              Absent Roll CSV <br /> or{" "}
            </h2>
            <div className="relative flex justify-center">
              <label
                className="flex items-center font-medium text-white bg-blue-500 rounded-3xl shadow-md cursor-pointer select-none text-lg px-6 py-2 hover:shadow-xl active:shadow-md"
                htmlFor="absent-file"
              >
                <span>Upload CSV File: {absentcsv?.name}</span>
              </label>
              <input
                id="absent-file"
                type="file"
                accept=".csv,.xlsx"
                name="file"
                onChange={onAbsentCsvFileHandler}
                className="absolute -top-full opacity-0"
              />
            </div>
            <p className="text-white font-medium my-3">Supported files: xlsx</p>
          </div>
          <div
            className=" max-w-l border-2 px-1 mt-1 text-center shadow-md pb-5"
            style={{ borderColor: "skyblue", borderRadius: "60px" }}
          >
            <img
              src={UploadFile}
              alt="uploadIcon"
              width={"10%"}
              className="mx-auto mt-5 pt-3 mb-4"
            />
            <h2 className="text-xl font-semibold text-white mb-4 mt-5">
              Overall Roll CSV <br /> or{" "}
            </h2>
            <div className="relative flex justify-center">
              <label
                className="flex items-center font-medium text-white bg-blue-500 rounded-3xl shadow-md cursor-pointer select-none text-lg px-6 py-2 hover:shadow-xl active:shadow-md"
                htmlFor="overall-file"
              >
                <span>Upload CSV File: {overallcsv?.name}</span>
              </label>
              <input
                id="overall-file"
                type="file"
                accept=".csv,.xlsx"
                name="file"
                onChange={onOverallCsvFileHandler}
                className="absolute -top-full opacity-0"
              />
            </div>
            <p className="text-white font-medium my-3">Supported files: xlsx</p>
          </div>
          <div
            className=" max-w-l border-2 px-1 mt-1 text-center shadow-md pb-5"
            style={{ borderColor: "skyblue", borderRadius: "60px" }}
          >
            <img
              src={UploadFile}
              alt="uploadIcon"
              width={"10%"}
              className="mx-auto mt-5 pt-3 mb-4"
            />
            <h2 className="text-xl font-semibold text-white mb-4 mt-5">
              Scanned Data CSV <br /> or{" "}
            </h2>
            <div className="relative flex justify-center">
              <label
                className="flex items-center font-medium text-white bg-blue-500 rounded-3xl shadow-md cursor-pointer select-none text-lg px-6 py-2 hover:shadow-xl active:shadow-md"
                htmlFor="scanned-file"
              >
                <span>Upload CSV File: {csvFile?.name}</span>
              </label>
              <input
                id="scanned-file"
                type="file"
                accept=".csv,.xlsx"
                name="file"
                onChange={onCsvFileHandler}
                className="absolute -top-full opacity-0"
              />
            </div>
            <p className="text-white font-medium my-3">Supported files: xlsx</p>
          </div>
          <div
            className=" max-w-l border-2 px-1 mt-1 text-center shadow-md pb-5"
            style={{ borderColor: "skyblue", borderRadius: "60px" }}
          >
            <img
              src={UploadFile}
              alt="uploadIcon"
              width={"10%"}
              className="mx-auto mt-5 pt-3 mb-4"
            />

            <h2 className="text-xl font-semibold text-white mb-4 mt-5">
              Drag and Drop file to upload <br /> or{" "}
            </h2>
            <div className="relative flex justify-center">
              <label
                className="flex items-center font-medium text-white bg-blue-500 rounded-3xl shadow-md cursor-pointer select-none text-lg px-6 py-2 hover:shadow-xl active:shadow-md"
                htmlFor="image-folder-upload"
              >
                <span>Upload Zip file: {imageFolder?.name}</span>
                <input
                  id="image-folder-upload"
                  type="file"
                  accept=".zip,.folder,.rar"
                  multiple
                  name="file"
                  onChange={onImageFolderHandler}
                  className="absolute -top-full opacity-0"
                />
              </label>
            </div>
            <p className="text-white font-medium my-3">Supported files: .zip</p>
          </div>
        </div>
      </div>
      <div className='flex justify-center max-w-full mt-3'>
        <button
          type="submit"
          onClick={onFileHeaderDetailsHandler}
          className="bg-teal-600 px-8 text-white py-3 text-xl font-medium rounded-3xl "
        >
          Save Files
        </button>
      </div>
    </div>
  )
}

export default TemplateList
