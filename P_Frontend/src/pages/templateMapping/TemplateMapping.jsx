import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

import HeaderData from "./HeaderData";
import HeaderMappedReview from "./HeaderMappedReview";

const apiurl = import.meta.env.VITE_URL

const TemplateMapping = () => {
    const [csvHeaders, setCsvHeaders] = useState([]);
    const [templateHeaders, setTemplateHeaders] = useState([]);
    const [selectedAssociations, setSelectedAssociations] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const { id } = useParams();
    console.log(id)
    const navigate = useNavigate();


    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await axios.get(`${apiurl}/template/${id}`)
                const templateData = response.data.templateData
                console.log(templateData)
                // const templateData = response?.find((data) => data.id == id);
                for (let i = 1; i <= templateData.pageCount; i++) {
                    templateData.templetedata.push({ attribute: `Image${i}` });
                }

                const selctedCoordinates = templateData.templetedata.map((item) => {
                    return item.attribute;
                });
                console.log(selctedCoordinates);
                // templateData.templetedata.push({ attribute: "Image" });
                setTemplateHeaders(selctedCoordinates);
            } catch (error) {
                console.log(error);
            }
        };
        fetchTemplate();
    }, [id]);





    useEffect(() => {
    async function fetchData() {
        try {
            const response = await axios.get(
                `${apiurl}/template/getcsvheader/${id}`
            );

            console.log(response.data);
            setCsvHeaders(response.data.headers);
        } catch (error) {
            console.error(error);
        }
    }

    if (id) {
        fetchData();
    }
}, [id]);



 const handleCsvHeaderChange = (csvHeader, index) => {
    const updatedAssociations = { ...selectedAssociations };
    updatedAssociations[csvHeader] = index;
    setSelectedAssociations(updatedAssociations);

    csvHeaders.forEach((header) => {
      if (!(header in updatedAssociations)) {
        updatedAssociations[header] = "";
      }
    });

    setSelectedAssociations(updatedAssociations);
  };
  console.log(selectedAssociations)


   const handleTemplateHeaderChange = (csvHeader, templateHeader) => {
    const updatedAssociations = { ...selectedAssociations };

    if (templateHeader.includes("--")) {
      const [min, max] = templateHeader.split("--");
      const newMin = parseInt(min);
      const newMax = parseInt(max);
      // Loop through all headers

      Object.keys(selectedAssociations).forEach((header) => {
        const questionNumber = parseInt(header.replace(/\D/g, ""));
        if (questionNumber >= newMin && questionNumber <= newMax) {
          updatedAssociations[header] = templateHeader;
        }
      });
    } else if (templateHeader === "UserFieldName") {
      updatedAssociations[csvHeader] = "";
    } else {
      updatedAssociations[csvHeader] = templateHeader;
    }
    // Ensure all headers are included in updatedAssociations
    csvHeaders.forEach((header) => {
      if (!(header in updatedAssociations)) {
        updatedAssociations[header] = "";
      }
    });

    setSelectedAssociations(updatedAssociations);
  };



   const onMapSubmitHandler = async () => {
    const mappedvalues = Object.values(selectedAssociations);

    for (let i = 1; i <= templateHeaders.pageCount; i++) {
      if (!mappedvalues.includes(`Image${i}`)) {
        toast.error("Please select all the field properly.");
        return;
      }
    }
    setSubmitLoading(true);
    const associationData = [];
    const obj = { ...selectedAssociations };
    for (let i = 0; i < csvHeaders.length; i++) {
      const header = csvHeaders[i];
      if (obj.hasOwnProperty(header)) {
        associationData.push({
          key: header,
          value: obj[header],
        });
      }
    }

    const mappedData = {
      mappedData: associationData,
      templateId: id,
    };

    try {
      // console.log(mappedData)
      // return 
    //   const response = await submitMappedData(mappedData);
    const response  = await axios.post(`${apiurl}/template/mapdata`,mappedData)
    console.log(response)
      if (response.status===200) {
        // toast.success("Mapping successfully done.");
        navigate(`/csvuploader/assigntask/${id}`);
      } else {
        // toast.error("Something went wrong");
      }
    } catch (error) {
    //   toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

    console.log(csvHeaders)
    return (
        <div className="min-h-[100vh] overflow-y-auto overflow-x-auto flex justify-center bg-gradient-to-r from-blue-400 to-blue-600 items-center templatemapping pt-20 pb-12">
            <div className="w-[900px] bg-white p-6 rounded-lg shadow-md relative">
                <label className="text-blue-800 text-4xl text-center mb-10">Mapping</label>
                <HeaderData
                  csvHeaders={csvHeaders}
                  handleTemplateHeaderChange={handleTemplateHeaderChange}
                  templateHeaders={templateHeaders}
                  selectedAssociations={selectedAssociations}
                  handleCsvHeaderChange={handleCsvHeaderChange}
                />
                <HeaderMappedReview
                  onMapSubmitHandler={onMapSubmitHandler}
                  setShowModal={setShowModal}
                  showModal={showModal}
                  selectedAssociations={selectedAssociations}
                  submitLoading={submitLoading}
                />
            </div>
        </div>
    )
}

export default TemplateMapping
