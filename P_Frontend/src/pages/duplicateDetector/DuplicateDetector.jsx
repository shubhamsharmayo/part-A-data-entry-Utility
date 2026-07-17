import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const apiurl = import.meta.env.VITE_URL;

const DuplicateDetector = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rollNoCol, setRollNoCol] = useState("");
  const [duplicateGroups, setDuplicateGroups] = useState([]);

  const handleCheckDuplicates = async () => {
    try {
      setChecking(true);
      const response = await axios.get(
        `${apiurl}/template/findduplicates/${id}`
      );

      if (response.data.success) {
        setRollNoCol(response.data.rollNoCol);
        setDuplicateGroups(response.data.duplicateGroups);
        setShowModal(true);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Unable to check duplicates"
      );
    } finally {
      setChecking(false);
    }
  };

  const handleComplete = () => {
    navigate(`/csvuploader/templatemapping/${id}`);
  };

  return (
    <div className="pt-[100px] min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex justify-center items-center">
      <div className="w-[420px] h-fit bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6"   style={{ color: "black" }}>
          Find Duplicates
        </h2>

        <div className="border rounded-md">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <span className="text-gray-500 font-medium">Headers</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-semibold text-gray-800">Roll No</span>
            <button
              type="button"
              onClick={handleCheckDuplicates}
              disabled={checking}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white px-4 py-1.5 rounded-full text-sm font-medium"
            >
              {checking ? "Checking..." : "Check"}
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={handleComplete}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md font-medium"
          >
            Complete
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-gray-900 opacity-60"></div>

            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-3xl w-full relative z-10">
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Duplicate Roll Numbers ({rollNoCol})
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {duplicateGroups.length === 0
                    ? "No duplicates found."
                    : `${duplicateGroups.length} duplicate roll number(s) found.`}
                </p>

                <div className="max-h-[420px] overflow-y-auto space-y-6">
                  {duplicateGroups.map((group) => (
                    <div
                      key={group.rollNo}
                      className="border rounded-md overflow-hidden"
                    >
                      <div className="bg-red-50 px-4 py-2 flex justify-between items-center">
                        <span className="font-semibold text-gray-800">
                          Roll No: {group.rollNo}
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          Repeated {group.count} times
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                          <thead className="bg-gray-100">
                            <tr>
                              {group.rows[0] &&
                                Object.keys(group.rows[0])
                                  .filter((key) => key !== "id")
                                  .map((key) => (
                                    <th
                                      key={key}
                                      className="px-3 py-2 whitespace-nowrap font-medium text-gray-600"
                                    >
                                      {key}
                                    </th>
                                  ))}
                            </tr>
                          </thead>
                          <tbody>
                            {group.rows.map((row, idx) => (
                              <tr key={idx} className="border-t">
                                {Object.keys(row)
                                  .filter((key) => key !== "id")
                                  .map((key) => (
                                    <td
                                      key={key}
                                      className="px-3 py-2 whitespace-nowrap text-gray-700"
                                    >
                                      {String(row[key] ?? "")}
                                    </td>
                                  ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuplicateDetector;
