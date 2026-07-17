import React, { useEffect, useState } from 'react'
import TemplateList from '../../components/csvuploaderComps/TemplateList'
import axios from 'axios'
import UploadFile from "../../assets/images/CsvUploaderImg copy.png";
import TemplateEdit from '../../components/csvuploaderComps/TemplateEdit';
import { useTemplate } from '../../context/templateData';
import TemplateRemove from '../../components/saveconfirm/TemplateDeleteConfirm';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

const apiurl = import.meta.env.VITE_URL
const Csvuploader = () => {
    const [allTemplate, setallTemplate] = useState([])
    const [selectedId, setselectedId] = useState(null)
    const [templatename, settemplatename] = useState(null)
    const [imageNames, setImageNames] = useState([]);
    const [imageFolder, setImageFolder] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [absentcsv, setAbsentcsv] = useState(null);
    const [overallcsv, setOverallcsv] = useState(null);
    const [editModal, setEditModal] = useState(false)
    const [editId, setEditId] = useState(null)
    const { template, setTemplate } = useTemplate()
    const [removeId, setRemoveId] = useState(null);
    const [removeModal, setRemoveModal] = useState(false);
    const [rollNumber, setRollNumber] = useState([])

    const navigate = useNavigate()

    const data = allTemplate?.templateData?.find((item) => item.id === selectedId)
    console.log(data)




    useEffect(() => {
        if (data?.imageColName) {
            setImageNames([data.imageColName])
        }
        if (data?.rollNoCol) {
            setRollNumber([data.rollNoCol])
        }
    }, [data])


    useEffect(() => {

        const getAllTemplate = async () => {
            const response = await axios.get(`${apiurl}/template/alltemplate`)
            console.log(response.data)
            setallTemplate(response.data)
        }
        getAllTemplate()

    }, [])

    const handleImageNameChange = (index, value) => {
        setImageNames((prevNames) => {
            const updatedNames = [...prevNames];
            updatedNames[index] = value;
            return updatedNames;
        });
    };


    const handleRollColChange = (index, value) => {
        setRollNumber((prevNames) => {
            const updatedNames = [...prevNames];
            updatedNames[index] = value;
            return updatedNames;
        });
    };





    const onCsvFileHandler = (event) => {
        const fileInput = event.target.files[0];
        console.log(fileInput)
        handleFileUpload(
            fileInput,
            ["csv", "xlsx"],
            "Please upload a CSV or Excel file.",
            setCsvFile
        );

    };
    const onAbsentCsvFileHandler = (event) => {
        const fileInput = event.target.files[0];
        handleFileUpload(
            fileInput,
            ["csv", "xlsx"],
            "Please upload a CSV or Excel file.",
            setAbsentcsv
        );

    };
    const onOverallCsvFileHandler = (event) => {
        const fileInput = event.target.files[0];
        handleFileUpload(
            fileInput,
            ["csv", "xlsx"],
            "Please upload a CSV or Excel file.",
            setOverallcsv
        );

    };

    const onImageFolderHandler = (event) => {
        const fileInput = event.target.files[0];
        console.log(fileInput);
        handleFileUpload(
            fileInput,
            ["zip", "folder", "rar"],
            "Please upload a ZIP file or a folder.",
            setImageFolder
        );


    };

    const handleFileUpload = (
        file,
        allowedExtensions,
        errorMessage,
        setFileState
    ) => {
        if (file) {
            const extension = file.name.split(".").pop().toLowerCase();
            console.log(extension)
            if (!allowedExtensions.includes(extension)) {
                // toast.error(errorMessage);
                console.log(errorMessage);
                return;
            }
            setFileState(file);
        }
    };
    const onFileHeaderDetailsHandler = async () => {

        try {
            const uploadedFiles = new FormData();

            uploadedFiles.append("scannedCsv", csvFile);
            uploadedFiles.append("absentCsv", absentcsv);
            uploadedFiles.append("overallCsv", overallcsv);
            uploadedFiles.append("rarFile", imageFolder);
            uploadedFiles.append("selectedTemplate", JSON.stringify(data));
            uploadedFiles.append("imageName", imageNames);
            uploadedFiles.append("rollCol", rollNumber);

            const response = await axios.post(
                `${apiurl}/template/fileupload`,
                uploadedFiles,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(response);
            toast.error(response)
            localStorage.setItem('fileId', JSON.stringify(response.data.fileData))

            // navigate(`/csvuploader/templatemapping/${data.id}`);
                 // sj
            navigate(`/csvuploader/duplicatedetector/${data.id}`);
                // {/* sj */}
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.response.data.message || "Something went wrong");
                }
            } else {
                toast.error("Unable to connect to the server");
            }
        }
    };

    const onTemplateEditHandler = async (id) => {
        console.log(id)
        const data = await axios.get(`${apiurl}/template/${id}`)

        console.log(data.data)

    }

    const onTemplateRemoveHandler = async (id) => {

        try {
            const deleteData = await axios.delete(`${apiurl}/template/delete/${id}`)
            console.log(allTemplate)
            const filtereddata = allTemplate?.templateData?.filter((item) => item.id !== id)
            console.log(filtereddata)
            setallTemplate({ "templateData": filtereddata })
            setRemoveModal(false)
        } catch (error) {
            console.log(error)
        }

    }







    return (
        <div className='pt-[100px] h-screen bg-gradient-to-r from-blue-400 to-blue-600'>
            <TemplateList
                allTemplate={allTemplate.templateData}
                setselectedId={setselectedId}
                selectedId={selectedId}
                settemplatename={settemplatename}
                templatename={templatename}
                data={data}
                imageNames={imageNames}
                handleImageNameChange={handleImageNameChange}
                UploadFile={UploadFile}
                imageFolder={imageFolder}
                csvFile={csvFile}
                absentcsv={absentcsv}
                overallcsv={overallcsv}
                onCsvFileHandler={onCsvFileHandler}
                onAbsentCsvFileHandler={onAbsentCsvFileHandler}
                onOverallCsvFileHandler={onOverallCsvFileHandler}
                onImageFolderHandler={onImageFolderHandler}
                setEditModal={setEditModal}
                setEditId={setEditId}
                setRemoveModal={setRemoveModal}
                setRemoveId={setRemoveId}
                onFileHeaderDetailsHandler={onFileHeaderDetailsHandler}
                handleRollColChange={handleRollColChange}
                rollNumber={rollNumber}
            />

            <TemplateEdit
                editModal={editModal}
                editId={editId}
                setEditModal={setEditModal}
                onTemplateEditHandler={onTemplateEditHandler} />

            <TemplateRemove
                removeModal={removeModal}
                onTemplateRemoveHandler={onTemplateRemoveHandler}
                setRemoveModal={setRemoveModal}
                removeId={removeId}
            />

        </div>
    )
}

export default Csvuploader
