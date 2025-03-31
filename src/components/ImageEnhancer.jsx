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
    const [sharpness, setSharpness] = useState(0); // New Deblur Feature

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

    // Handle image processing and download
    const handleDownload = () => {
        if (!imageRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imageRef.current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Apply filters
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

        // Apply sharpening filter if needed
        if (sharpness > 0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            applySharpening(imageData, sharpness);
            ctx.putImageData(imageData, 0, 0);
        }

        // Create a download link
        const link = document.createElement("a");
        link.download = "edited-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    // Apply sharpening filter (Deblur)
    const applySharpening = (imageData, level) => {
        const kernel = [
            [0, -1, 0],
            [-1, 5 + level, -1],
            [0, -1, 0]
        ];

        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let r = 0, g = 0, b = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
                        const weight = kernel[ky + 1][kx + 1];

                        r += data[pixelIndex] * weight;
                        g += data[pixelIndex + 1] * weight;
                        b += data[pixelIndex + 2] * weight;
                    }
                }
                const index = (y * width + x) * 4;
                data[index] = Math.min(Math.max(r, 0), 255);
                data[index + 1] = Math.min(Math.max(g, 0), 255);
                data[index + 2] = Math.min(Math.max(b, 0), 255);
            }
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-800 min-h-screen p-6">
            {/* Centered Title */}
            <h1 className="text-4xl font-bold text-white mb-6 text-center w-full">
                Image Enhancer
            </h1>

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
                <input type="range" min="0" max="5" value={sharpness} onChange={(e) => setSharpness(e.target.value)} className="w-full" />
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
