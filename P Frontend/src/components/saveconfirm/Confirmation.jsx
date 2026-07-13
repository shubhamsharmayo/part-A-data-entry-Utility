import { useState, useEffect } from "react";
import { useTemplate } from "../../context/templateData";
import { FaGripHorizontal, FaRegSquare, FaSave, FaTimes } from "react-icons/fa";

export default function OptionGenerator({ savedData, setSavedData, setoptionGeneratorModel, template }) {
    const [data, setData] = useState({
        pattern: "",
        blank: "",
        optionCount: "",
        optionType: "uppercase",
        optionValues: [],
    });
    const { setMetaData } = useTemplate()
    console.log(data.blank)

    useEffect(() => {
        if (template) {
            // Map template properties to form state
            const blankValue = template.blankDefination === 'space' ? '' : (template.blankDefination || '');

            // Detect option type and count from existing optionValues (template.typeOption)
            let detectedOptionType = 'uppercase';
            let detectedOptionCount = template.typeOption?.length || 0;

            if (template.typeOption && Array.isArray(template.typeOption) && template.typeOption.length > 0) {
                const firstVal = template.typeOption[0];
                // Check if all are single uppercase letters
                const isUpperCase = template.typeOption.every(v =>
                    typeof v === 'string' && v.length === 1 && v >= 'A' && v <= 'Z'
                );
                // Check if all are single lowercase letters
                const isLowerCase = template.typeOption.every(v =>
                    typeof v === 'string' && v.length === 1 && v >= 'a' && v <= 'z'
                );
                // Check if all are numbers (as strings)
                const isNumbers = template.typeOption.every(v =>
                    typeof v === 'string' && !isNaN(Number(v)) && v.trim() !== ''
                );

                if (isUpperCase) {
                    detectedOptionType = 'uppercase';
                } else if (isLowerCase) {
                    detectedOptionType = 'lowercase';
                } else if (isNumbers) {
                    detectedOptionType = 'numbers';
                } else {
                    // Default to uppercase if we can't determine
                    detectedOptionType = 'uppercase';
                }
            }

            setData({
                pattern: template.patternDefinition || '',
                blank: blankValue,
                optionCount: detectedOptionCount.toString(),
                optionType: detectedOptionType,
                optionValues: [...(template.typeOption || [])],
            });
        }
    }, [template]);

    const handleSave = () => {
        let values = [];

        const total = Number(data.optionCount);

        if (total > 0) {
            switch (data.optionType) {
                case "uppercase":
                    values = Array.from(
                        { length: total },
                        (_, i) => String.fromCharCode(65 + i)
                    );
                    break;

                case "lowercase":
                    values = Array.from(
                        { length: total },
                        (_, i) => String.fromCharCode(97 + i)
                    );
                    break;

                case "numbers":
                    values = Array.from(
                        { length: total },
                        (_, i) => i + 1
                    );
                    break;
            }
        }

        const finalData = {
            ...data,
            optionValues: values,
        };

        setSavedData(finalData);
        setMetaData(finalData)
        setoptionGeneratorModel(false)

        console.log("Saved Data", finalData);
    };

    const generate = (type, count) => {
        const total = Number(count);

        if (!total || total <= 0) {
            setData((prev) => ({ ...prev, optionValues: [] }));
            return;
        }

        let values = [];

        switch (type) {
            case "uppercase":
                values = Array.from(
                    { length: total },
                    (_, i) => String.fromCharCode(65 + i)
                );
                break;

            case "lowercase":
                values = Array.from(
                    { length: total },
                    (_, i) => String.fromCharCode(97 + i)
                );
                break;

            case "numbers":
                values = Array.from(
                    { length: total },
                    (_, i) => i + 1
                );
                break;

            default:
                values = [];
        }

        setData((prev) => ({
            ...prev,
            optionType: type,
            optionValues: values,
        }));
    };

    return (
       <div className="space-y-6 rounded-2xl border border-gray-200 bg-white shadow-2xl p-6">

  {/* Header */}
  <div className="border-b pb-4">
    <h2 className="text-2xl font-bold text-gray-800">
      Option Generator
    </h2>
    <p className="text-sm text-gray-500 mt-1">
      Configure the pattern and blank value.
    </p>
  </div>

  {/* Pattern */}
  <div className="space-y-2">

    <label className="flex items-center gap-2 font-semibold text-gray-700">
      <FaGripHorizontal className="text-blue-600" />
      Pattern
    </label>

    <input
      type="text"
      placeholder="Enter Pattern"
      value={data.pattern}
      onChange={(e) =>
        setData({
          ...data,
          pattern: e.target.value,
        })
      }
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        bg-gray-50
        px-4
        py-3
        text-black
        transition-all
        duration-300
        focus:border-blue-500
        focus:bg-white
        focus:ring-4
        focus:ring-blue-100
        outline-none
      "
    />

  </div>

  {/* Blank */}

  <div className="space-y-2">

    <label className="flex items-center gap-2 font-semibold text-gray-700">
      <FaRegSquare className="text-blue-600" />
      Blank Value
    </label>

    <input
      type="text"
      placeholder="Enter Blank Value"
      value={data.blank}
      onChange={(e) =>
        setData({
          ...data,
          blank: e.target.value,
        })
      }
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
        text-black
      "
    />

  </div>

  {/* Footer */}

  <div className="flex justify-end gap-4 pt-4 border-t">

    <button
      onClick={() => setoptionGeneratorModel(false)}
      className="
        flex
        items-center
        gap-2
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
      <FaTimes />
      Cancel
    </button>

    <button
      onClick={handleSave}
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
      {/* Shine Effect */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>

      <span className="relative flex items-center gap-2">
        <FaSave />
        Save
      </span>
    </button>

  </div>

</div>
    );
}