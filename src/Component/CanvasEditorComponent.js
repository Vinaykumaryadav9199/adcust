import React, { useState, useEffect, useRef } from 'react';
import CanvasEditor from './CanvasEditor';
import templateData from './TemplateData';
import upicon from "../image/upicon.png"
import room from "../image/room1.jpg"

const CanvasEditorComponent = () => {
  const canvasRef = useRef(null);
  const [canvasEditor, setCanvasEditor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bgColor, setBgColor] = useState(templateData.urls.background_color || '#0369A1');
  const [captionText, setCaptionText] = useState(templateData.caption.text);
  const [ctaText, setCtaText] = useState(templateData.cta.text);
  const [selectedColors, setSelectedColors] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000'); // Default current color

  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const captionInput = document.getElementById('captionInput'); // Get the input element by ID
  //     setCanvasEditor(new CanvasEditor(canvasRef, templateData, captionInput ,selectedImage));
  //   }
  // }, [canvasRef,selectedImage]);
  useEffect(() => {
    if (canvasRef.current) {
      const captionInput = document.getElementById('captionInput'); // Get the input element by ID
      const initialCanvasEditor = new CanvasEditor(canvasRef, templateData, captionInput);
      initialCanvasEditor.setImage(room); // Set default image here
      setCanvasEditor(initialCanvasEditor);
    }
  }, [canvasRef]);


  // useEffect(() => {
  //   if (canvasEditor) {
  //     canvasEditor.initializeCanvas();
  //   }
  // }, [canvasEditor, selectedImage, bgColor, ctaText]);
  useEffect(() => {
    if (canvasEditor) {
      canvasEditor.initializeCanvas();
    }
  }, [canvasEditor, bgColor, ctaText, room]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        canvasEditor.setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgColorChange = (color) => {
    setBgColor(color);
    canvasEditor.setBgColor(color);
  };

  const handleCaptionChange = (e) => {
    const text = e.target.value;
    setCaptionText(text);
  };

  const handleCtaChange = (e) => {
    const text = e.target.value;
    setCtaText(text);
    canvasEditor.setCtaText(text);
  };

  const handleColorSelection = (color) => {
    setCurrentColor(color);
    setSelectedColors([color, ...selectedColors.slice(0, 4)]);
    setShowColorPicker(false);
    handleBgColorChange(color); // Change background color when a color is selected
  };

  return (
    <div className=' flex w-screen h-screen  flex-wrap '>
      <div className='w-1/2 h-screen  '>
        <div className='flex justify-center w-full h-full'>
        <canvas ref={canvasRef} height={1080} width={1080} style={{ height: '400px', width: '400px', backgroundColor:"transparent",}} />
        </div>
      </div>
      <div className='w-1/2 h-full flex flex-col gap-2 mt-10 items-center p-6'>
        <div>
          <h3 className=' text-center font-bold '>Ad customization</h3>
          <h4 className=' text-center text-xs text-gray-400'>Customise your ad and get the templates accordingly</h4>
        </div>
        <div className='w-[80%] mt-6 py-2 border  border-gray-300 shadow-sm flex flex-col  justify-center  rounded-lg' >
          <div className=" ml-2 flex justify-start items-center text-xs ">
            <img src={upicon}  alt='icon' className=' w-4  mr-2' />
            <label className=" ">Change the ad creative image.</label>
            <label htmlFor="fileInput" className="cursor-pointer underline text-cyan-500">
              select file
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className='w-[80%] flex items-center my-6 text-xs text-gray-400 '>
          <div className=' border border-t-gray-300 w-[40%]  h-0 mr-2'></div>
          <div>
            <span>Edit contents</span>
          </div>
          <div className=' border border-t-gray-300 w-[40%]  h-0 ml-2'></div>

        </div>
        <div className=' w-[80%] border border-t-gray-300  flex flex-col pl-2 rounded-md shadow-sm'>
          <label className='text-gray-400 text-xs'>Ad content</label>
          <input id="captionInput" type="text" value={captionText} onChange={handleCaptionChange}   className=' text-sm font-serif '/>
        </div>
        <div className=' w-[80%] border border-t-gray-300  flex flex-col pl-2 rounded-md mt-2 shadow-sm'>
          <label className='text-gray-400 text-xs'>CTA</label>
          <input type="text" value={ctaText} onChange={handleCtaChange}  className=' text-sm font-serif '/>
        </div>
        <div className=' flex   w-[80%] flex-col '>
          <div>
            <p className='text-gray-400 text-xs mb-2'>Choose your color</p>
          </div>
          {/* Render the last 5 picked colors */}
          <div className=' flex  items-center gap-1'>
          {selectedColors.map((color, index) => (
            <div key={index} style={{ backgroundColor: color, width: '30px', height: '30px', display: 'inline-block', marginRight: '5px', cursor: 'pointer',borderRadius:"99px"}} onClick={() => handleBgColorChange(color)}></div>
          ))}
          {/* Render the '+' button to open the color picker popover */}
          <button onClick={() => setShowColorPicker(!showColorPicker)} className='w-8 h-8 bg-gray-300 rounded-3xl'><p className=' font-semibold text-lg ' >+</p></button>
          {/* Render the color picker popover */}
          </div>
        
          {showColorPicker && (
            <div  className=' flex flex-col justify-center  w-[80%] items-center'>
              <div  className=''>
                <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)}  className='w-32 h-10'/>
                <div className=' flex  gap-3 justify-center'>
                <button onClick={() => handleColorSelection(currentColor)} className=' bg-green-600 px-3 py-1 rounded-md'>Select</button>
                <button onClick={() => setShowColorPicker(false)} className='bg-red-600 px-3 py-1 rounded-md'>Close</button>
                </div>
               
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasEditorComponent;
