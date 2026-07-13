import axios from "axios";


const apiurl = import.meta.env.VITE_URL

export const updateCurrentIndex = async (taskId, direction,parentId,email) => {
  
  // http://localhost:4000/getcsvheaders?templateId=1
  try {
    const response = await axios.post(
      `${apiurl}/update/currentindex`,
      {
        taskId: taskId,
        direction: direction,
        parentId:parentId,
        email:email
      },
      
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const dataEntryMetaData = async (templateId, columnName) => {

  // http://localhost:4000/getcsvheaders?templateId=1
  try {
    const response = await axios.get(
      `${apiurl}/get/metadata?templateId=${templateId}&columnName=${columnName}`,
      
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};






export const changeTaskStatus = async (taskId) => {

  try {
    const response = await axios.get(
      `${apiurl}/submit/${taskId}`,
      
      
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data;
  }
};


export const updateCsvData = async (obj) => {
 
  // http://localhost:4000/getcsvheaders?templateId=1
  try {
    const response = await axios.post(
      `${apiurl}/update/csvdata`,
      obj,
    
    );
    return response;
  } catch (error) {
    console.log(error);
    return error
  }
};