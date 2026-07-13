import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageCanvas from '../../components/Imagecanvas';
import { useTemplate } from '../../context/templateData';

const apiurl = import.meta.env.VITE_URL;

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setTemplate } = useTemplate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await axios.get(`${apiurl}/template/${id}`);
        const templateData = res.data.templateData || res.data;
        console.log(templateData)

        // Parse metadata into boxes format
        const boxes = (templateData?.templetedata || []).map(meta => ({
          name: meta.attribute || '',
          x: parseFloat(meta.coordinateX) || 0,
          y: parseFloat(meta.coordinateY) || 0,
          width: parseFloat(meta.width) || 0,
          height: parseFloat(meta.height) || 0,
          category: meta.fieldType || 'formfield',
          type: meta.dataFieldType || 'alphanumeric',
          length: meta.fieldLength || '',
          id:meta.id
        }));

        // Determine original blank value (convert 'space' back to ' ')
        const blankDefination = templateData.blankDefination === 'space' ? '' : (templateData.blankDefination || '');
        const templateObj = {
          templateName: templateData.name || '',
          typeOption: templateData.typeOption || [],
          patternDefinition: templateData.patternDefinition || '',
          blankDefination: blankDefination,
          boxes: boxes,
        };
        // console.log(boxes)

        // Set template context for ImageCanvas to use
        setTemplate(templateObj);

        // Handle image
        if (templateData.imagePath) {
          try {
            const imgRes = await axios.get(`${apiurl}/uploads/${templateData.imagePath}`, {
              responseType: 'blob',
            });
            const blob = new Blob([imgRes.data], { type: imgRes.data.type || 'image/png' });
            const imageFile = new File([blob], templateData.imagePath, { type: imgRes.data.type || 'image/png' });
            setFile(imageFile);
            setImageUrl(URL.createObjectURL(imageFile));
          } catch (imgErr) {
            console.warn('Failed to fetch image:', imgErr);
            setImageUrl('');
            setFile(null);
          }
        } else {
          setImageUrl('');
          setFile(null);
        }
      } catch (err) {
        console.error('Error fetching template:', err);
        setError('Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, setTemplate]);

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 p-6 ">
      
        {/* <h1 className="text-2xl font-bold mb-6 text-center text-white">Edit Template</h1> */}
        <div className="bg-white rounded-lg shadow-md ">
          <ImageCanvas
            image={imageUrl}
            file={file}
            method="PUT"
            endpoint={`/template/updatetemplate/${id}`}
            redirectOnSuccess="/csvuploader"
          />
        </div>
      
    </div>
  );
}