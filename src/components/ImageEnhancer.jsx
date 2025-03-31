import React, { useState, useRef } from "react";

const ImageEnhancer = () => {
    const [image, setImage] = useState(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [grayscale, setGrayscale] = useState(0);
    const [sepia, setSepia] = useState(0);
    const [invert, setInvert] = useState(0);
    const [hueRotate, setHueRotate] = useState(0);
    const [blur, setBlur] = useState(0);
    
    const imageRef = useRef(null);
    const canvasRef = useRef(null);

    // Handle image selection
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle image download
    const handleDownload = () => {
        if (!imageRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imageRef.current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.filter = `
            brightness(${brightness}%) 
            contrast(${contrast}%) 
            saturate(${saturation}%) 
            grayscale(${grayscale}%) 
            sepia(${sepia}%) 
            invert(${invert}%) 
            hue-rotate(${hueRotate}deg) 
            blur(${blur}px)
        `;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Create a download link
        const link = document.createElement("a");
        link.download = "edited-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div className="flex flex-col items-center bg-gray-800 min-h-screen p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Image Enhancer</h1>

            {/* Image Upload */}
            <input type="file" onChange={handleImageUpload} className="mb-4 bg-white p-2 rounded" />

            {/* Image Filters */}
            <div className="filters w-full max-w-md bg-gray-700 p-4 rounded-lg text-white mt-4">
                <label>Brightness:</label>
                <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="w-full" />
                
                <label>Contrast:</label>
                <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(e.target.value)} className="w-full" />
                
                <label>Saturation:</label>
                <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} className="w-full" />
                
                <label>Grayscale:</label>
                <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(e.target.value)} className="w-full" />
                
                <label>Sepia:</label>
                <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(e.target.value)} className="w-full" />
                
                <label>Invert Colors:</label>
                <input type="range" min="0" max="100" value={invert} onChange={(e) => setInvert(e.target.value)} className="w-full" />
                
                <label>Hue Rotation:</label>
                <input type="range" min="0" max="360" value={hueRotate} onChange={(e) => setHueRotate(e.target.value)} className="w-full" />
                
                <label>Blur:</label>
                <input type="range" min="0" max="10" value={blur} onChange={(e) => setBlur(e.target.value)} className="w-full" />
            </div>

            {/* Image Preview */}
            {image && (
                <div className="image-preview mt-6 flex flex-col items-center">
                    <img
                        ref={imageRef}
                        src={image}
                        alt="Edited"
                        className="w-full max-w-lg h-auto object-contain rounded-lg shadow-md"
                        style={{
                            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) invert(${invert}%) hue-rotate(${hueRotate}deg) blur(${blur}px)`,
                        }}
                    />
                    {/* Download Button */}
                    <button onClick={handleDownload} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Download Image
                    </button>
                </div>
            )}

            {/* Hidden Canvas for Image Processing */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default ImageEnhancer;
