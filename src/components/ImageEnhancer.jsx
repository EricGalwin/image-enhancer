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
    const [sharpness, setSharpness] = useState(0);
    const [resolutionScale, setResolutionScale] = useState(1);

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

    // Enhance Resolution
    const enhanceResolution = () => {
        if (!image) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.src = image;

        img.onload = () => {
            canvas.width = img.width * resolutionScale;
            canvas.height = img.height * resolutionScale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const enhancedImage = canvas.toDataURL("image/png");
            setImage(enhancedImage);
        };
    };

    // Apply Filters + Deblur
    const applyFilters = () => {
        if (!imageRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imageRef.current;
        canvas.width = img.naturalWidth * resolutionScale;
        canvas.height = img.naturalHeight * resolutionScale;

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

        // Deblurring (Sharpening)
        if (sharpness > 0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                data[i] = data[i] + sharpness; // Red
                data[i + 1] = data[i + 1] + sharpness; // Green
                data[i + 2] = data[i + 2] + sharpness; // Blue
            }

            ctx.putImageData(imageData, 0, 0);
        }

        setImage(canvas.toDataURL("image/png"));
    };

    // Handle image download
    const handleDownload = () => {
        applyFilters(); // Apply filters before downloading

        const link = document.createElement("a");
        link.download = "enhanced-image.png";
        link.href = image;
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

                <label>Sharpness (Deblur):</label>
                <input type="range" min="0" max="50" value={sharpness} onChange={(e) => setSharpness(e.target.value)} className="w-full" />

                <label>Resolution Scale:</label>
                <input type="range" min="1" max="4" step="0.1" value={resolutionScale} onChange={(e) => setResolutionScale(e.target.value)} onMouseUp={enhanceResolution} className="w-full" />
            </div>

            {/* Image Preview */}
            {image && (
                <div className="image-preview mt-6 flex flex-col items-center">
                    <img
                        ref={imageRef}
                        src={image}
                        alt="Enhanced"
                        className="w-full max-w-lg h-auto object-contain rounded-lg shadow-md"
                        style={{
                            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) invert(${invert}%) hue-rotate(${hueRotate}deg) blur(${blur}px)`,
                        }}
                    />
                    
                    {/* Apply Filters Button */}
                    <button onClick={applyFilters} className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Apply Enhancements
                    </button>

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
