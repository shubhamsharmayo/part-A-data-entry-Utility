import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import OptionGenerator from '../components/saveconfirm/Confirmation'
import { useTemplate } from "../context/templateData";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const apiurl = import.meta.env.VITE_URL

export default function ImageCanvas({
  image,
  file,
  method = 'POST',
  endpoint = '/template/createtemplate',
  redirectOnSuccess = '/createtemplate'
}) {
  const navigate = useNavigate()
  const imageRef = useRef(null);

  const [boxes, setBoxes] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [optionGeneratorModel, setoptionGeneratorModel] = useState(false)
  const [savedData, setSavedData] = useState(null);
  const {
    template,
    setTemplate,
    addBox,
    deleteBox,
    updateBox,
    setTemplateName
  } = useTemplate();
  console.log(template)


  const [fieldData, setFieldData] = useState({
    category: "formfield",
    type: "alphanumeric",
    length: "",
    name: "",
    start: "",
    end: "",
  });

  const [startPoint, setStartPoint] = useState({
    x: 0,
    y: 0,
  });

  const [currentBox, setCurrentBox] = useState(null);

  const getCoordinates = (e) => {
    const rect = imageRef.current.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getCoordinates(e);

    setDrawing(true);

    setStartPoint({
      x,
      y,
    });

    setCurrentBox({
      x,
      y,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const { x, y } = getCoordinates(e);

    setCurrentBox({
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
    });
  };

  const handleMouseUp = () => {
    if (!currentBox) return;

    setDrawing(false);

    if (currentBox.width < 5 || currentBox.height < 5) {
      setCurrentBox(null);
      return;
    }

    setShowFieldModal(true);

    // if (!name) {
    //   setCurrentBox(null);
    //   return;
    // }

    // setBoxes((prev) => [
    //   ...prev,
    //   {
    //     id: Date.now(),
    //     name,
    //     ...currentBox,
    //   },
    // ]);

    // setCurrentBox(null);
  };

  const handleSaveField = () => {
    const id = Date.now();

    let boxData = { ...currentBox };

    if (fieldData.category === 'questionfield') {
      const startNum = parseInt(fieldData.start, 10);
      const endNum = parseInt(fieldData.end, 10);
      if (isNaN(startNum) || isNaN(endNum)) {
        alert('Please enter valid start and end numbers');
        return;
      }
      if (startNum > endNum) {
        alert('Start number must be less than or equal to end number');
        return;
      }
      const generatedValues = Array.from({ length: endNum - startNum + 1 }, (_, i) => startNum + i);
      // Update template metadata for options
      // setMetaData({
      //   optionCount: generatedValues.length.toString(),
      //   optionType: 'numbers',
      //   optionValues: generatedValues,
      // });
      // Set the box's name to be in format "start--end"
      boxData = {
        ...boxData,
        ...fieldData,
        name: `${fieldData.start}--${fieldData.end}`
      };
    } else {
      // For formfield, we just add the box with fieldData (type, length, name)
      boxData = {
        ...boxData,
        ...fieldData
      };
    }

    addBox({
      id,
      ...boxData,
    });

    setSelectedBoxId(id);

    // Reset fieldData to initial state
    setFieldData({
      category: "formfield",
      type: "alphanumeric",
      length: "",
      name: "",
      start: "",
      end: ""
    });

    setCurrentBox(null);
    setShowFieldModal(false);
  };


  const handleTemplateSave = async () => {
    const formdata = new FormData()

    if (file) {
      formdata.append("image", file)
    }
    formdata.append("template", JSON.stringify(template))

    console.log(formdata)

    try {
      const response = await axios({
        method: method,
        url: `${apiurl}${endpoint}`,
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      console.log(response)
      if (response?.data?.message?.includes('successfully') || response?.data?.message) {
        toast.success("Template Created")
        navigate(redirectOnSuccess)
      }
    } catch (err) {
      console.error('Error saving template:', err)
    }
  }

  console.log(template)

  return (
    <div className="flex  pt-[100px] px-5 bg-gradient-to-r from-blue-400 to-blue-600 justify-around">
      {/* Image Section */}

      {/* Coordinate Panel */}
      <div className="flex gap-4 flex-col">
        <div className="w-96 h-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="sticky top-0  flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
            <h2 className="text-xl font-bold">Selected Areas</h2>

            <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
              {template?.boxes.length}
            </span>
          </div>

          {/* List */}
          <div className="h-[530px] space-y-3 overflow-y-auto p-4">

            {template?.boxes.length === 0 && (
              <div className="mt-20 text-center text-gray-500">
                <div className="mb-3 text-5xl">📄</div>
                <p>No areas selected yet.</p>
              </div>
            )}

            {template?.boxes.map((box, index) => (
              <div
                key={box.id}
                className="
          group
          rounded-xl
          border
          border-gray-200
          bg-gradient-to-r
          from-white
          to-blue-50
          p-4
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-blue-400
          hover:shadow-xl
        "
              >
                <div className="flex items-center justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {box.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          ID: {box.id}
                        </p>
                      </div>

                    </div>

                  </div>

                  <button
                    onClick={() => deleteBox(box.id)}
                    className="
              rounded-lg
              bg-red-500
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition-all
              duration-300
              hover:scale-105
              hover:bg-red-600
              active:scale-95
            "
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}
          </div>
        </div>
        <div className="w-full">


          <input
            type="text"
            placeholder="Template Name"
            value={template.templateName}
            onChange={(e) =>
              setTemplateName(
                { templateName: e.target.value, }
              )}

            className="
          w-full
          px-4
          py-3
          rounded-lg
          border
          border-gray-300
          bg-white
          text-gray-800
          placeholder:text-gray-400
          shadow-sm
          outline-none
          transition-all
          duration-200
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
          "
          />


        </div>

        <button onClick={() => setoptionGeneratorModel(true)} className="px-8 py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition">
          Select Pattern
        </button>
        <button onClick={handleTemplateSave} className="px-8 py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition">
          Save Template
        </button>

      </div>

      {optionGeneratorModel && (
        <Rnd
          default={{
            x: 200,
            y: 100,
            width: 400,
            height: "auto",
          }}
          style={{
            zIndex: 9999,
            position: "fixed",
          }}
          bounds="window"
          dragHandleClassName="drag-header"
          enableResizing={false}
          minWidth={400}

          onMouseDown={(e) => e.stopPropagation()}

        >
          <div className="bg-white shadow-2xl rounded-lg border overflow-hidden z-[9999] ">
            <div className="drag-header cursor-move bg-blue-600 text-white px-4 py-2 font-semibold">
              Configure Selected Area
            </div>
            <OptionGenerator savedData={savedData} setSavedData={setSavedData} setoptionGeneratorModel={setoptionGeneratorModel} template={template} />
          </div>
        </Rnd>
      )}




      <div>
        <div className=" w-fit h-[calc(100vh-100px)] overflow-auto border rounded-lg">
          <div
            className="relative inline-block select-none "
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={image}
              alt="template"
              draggable={false}
              style={{
                width: "48rem",
                cursor: "crosshair",
              }}
            />

            {/* Existing Boxes */}

            {template?.boxes.map((box) => (
              <div
                key={box.id}
                className={`absolute border-2 ${selectedBoxId === box.id
                  ? "border-blue-600 bg-blue-500/20"
                  : "border-red-500 bg-red-500/20"
                  }`}
                style={{
                  left: box.x,
                  top: box.y,
                  width: box.width,
                  height: box.height,
                }}
              >
                <div className="absolute -top-6 left-0 bg-red-600 text-white text-xs px-1 rounded whitespace-nowrap">
                  {box.name}
                </div>
              </div>
            ))}

            {/* Drawing Rectangle */}

            {currentBox && (
              <div
                className="absolute border-2 border-blue-600 bg-blue-500/20"
                style={{
                  left: currentBox.x,
                  top: currentBox.y,
                  width: currentBox.width,
                  height: currentBox.height,
                }}
              />
            )}
          </div>
        </div>
      </div>
      {showFieldModal && (
  <Rnd
    default={{
      x: 250,
      y: 100,
      width: 460,
      height: "auto",
    }}
    bounds="window"
    dragHandleClassName="drag-header"
    enableResizing={false}
    minWidth={460}
    onMouseDown={(e) => e.stopPropagation()}
  >
    <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl">

      {/* Header */}
      <div className="drag-header cursor-move bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Configure Area
            </h2>

           
          </div>

          

        </div>

      </div>

      <div className="space-y-5 p-6">

        {/* Category */}

        <div>

          <label className="mb-2 block font-semibold text-gray-700">
            Category
          </label>

          <select
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              bg-gray-50
              px-4
              py-3
              transition-all
              duration-300
              focus:border-blue-500
              focus:bg-white
              focus:ring-4
              focus:ring-blue-100
              outline-none
            "
            defaultValue="formfield"
            value={fieldData.category}
            onChange={(e) =>
              setFieldData({
                ...fieldData,
                category: e.target.value,
              })
            }
          >
            <option value="formfield">Form Field</option>
            {/* <option value="questionfield">Question Field</option> */}
          </select>

        </div>

        {fieldData.category === "formfield" ? (
          <>
            {/* Type */}

            <div>

              <label className="mb-2 block font-semibold text-gray-700">
                Field Type
              </label>

              <select
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                value={fieldData.type}
                onChange={(e) =>
                  setFieldData({
                    ...fieldData,
                    type: e.target.value,
                  })
                }
              >
                <option value="alpha">Alpha</option>
                <option value="numeric">Numeric</option>
                <option value="alphanumeric">
                  Alphanumeric
                </option>
              </select>

            </div>

            {/* Two Column */}

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="mb-2 block font-semibold text-gray-700">
                  Length
                </label>

                <input
                  type="number"
                  value={fieldData.length}
                  onChange={(e) =>
                    setFieldData({
                      ...fieldData,
                      length: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                />

              </div>

              <div>

                <label className="mb-2 block font-semibold text-gray-700">
                  Field Name
                </label>

                <input
                  value={fieldData.name}
                  onChange={(e) =>
                    setFieldData({
                      ...fieldData,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                />

              </div>

            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="mb-2 block font-semibold text-gray-700">
                Start
              </label>

              <input
                type="number"
                value={fieldData.start}
                onChange={(e) =>
                  setFieldData({
                    ...fieldData,
                    start: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold text-gray-700">
                End
              </label>

              <input
                type="number"
                value={fieldData.end}
                onChange={(e) =>
                  setFieldData({
                    ...fieldData,
                    end: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />

            </div>

          </div>
        )}

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t pt-5">

          <button
            onClick={() => {
              setCurrentBox(null);
              setShowFieldModal(false);
            }}
            className="
              rounded-xl
              border
              border-gray-300
              px-6
              py-3
              font-medium
              text-gray-700
              transition-all
              duration-300
              hover:bg-gray-100
              hover:scale-105
              active:scale-95
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSaveField}
            className="
              group
              relative
              overflow-hidden
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-6
              py-3
              font-medium
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-2xl
              active:scale-95
            "
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>

            <span className="relative">
              Save Changes
            </span>

          </button>

        </div>

      </div>

    </div>
  </Rnd>
)}
    </div>
  );
}