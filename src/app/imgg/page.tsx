"use client"
import React, { useState } from 'react';

const UploadImage = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // ฟังก์ชันจัดการเมื่อผู้ใช้เลือกไฟล์
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // แปลงรูปเป็น base64
            };
            reader.readAsDataURL(file); // อ่านไฟล์
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Upload and Preview Image</h1>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            {imagePreview && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Preview:</h3>
                    <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
            )}
        </div>
    );
};

export default UploadImage;