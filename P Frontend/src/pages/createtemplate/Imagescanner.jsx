import { useLocation } from "react-router-dom";
import ImageCanvas from "../../components/Imagecanvas";
import { useTemplate } from "../../context/templateData";
import { useEffect } from "react";

const Imagescanner = () => {
    const { state } = useLocation();
    const {setTemplate} = useTemplate()

    useEffect(() => {
      setTemplate({boxes: [],
        templateName:"",
        pattern: "",
        blank: "",
        optionCount: "",
        optionType: "uppercase",
        optionValues: []})
    }, [])
    

  return (
    <div className="">
      <ImageCanvas image={state.image} file={state.file} />
    </div>
  );
}

export default Imagescanner
