import { createContext, useContext, useState } from "react";

const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
    const [template, setTemplate] = useState({
        image: null,
        boxes: [],
        templateName:"",
        pattern: "",
        blank: "",
        optionCount: "",
        optionType: "uppercase",
        optionValues: [],
    });

    const addBox = (box) => {
        setTemplate((prev) => ({
            ...prev,
            boxes: [...prev.boxes, box],
        }));
    };

    const updateBox = (id, updatedBox) => {
        setTemplate((prev) => ({
            ...prev,
            boxes: prev.boxes.map((box) =>
                box.id === id ? updatedBox : box
            ),
        }));
    };

    const deleteBox = (id) => {
        setTemplate((prev) => ({
            ...prev,
            boxes: prev.boxes.filter((box) => box.id !== id),
        }));
    };

    const setMetaData = (value)=>{
        console.log(value)
        setTemplate((prev)=>({
            ...prev,
           ...value
        }))
    }

    const setTemplateName = (value)=>{
        setTemplate((prev)=>({
            ...prev,
            ...value
        }))
    }

    const setImage = (value)=>{
        setTemplate((prev)=>({
            ...prev,
            image:value
        }))
    }

    // const setPattern = (value) => {
    //     pattern: value
    // }

    // const setBlank = (value) => {
    //     blank: value
    // }

    //   const 

    return (
        <TemplateContext.Provider
            value={{
                template,
                setTemplate,
                addBox,
                updateBox,
                deleteBox,
                setMetaData,
                setTemplateName
            }}
        >
            {children}
        </TemplateContext.Provider>
    );
};

export const useTemplate = () =>{return useContext(TemplateContext);}