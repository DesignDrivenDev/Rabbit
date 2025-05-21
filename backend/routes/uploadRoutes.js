import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const originalName = path.parse(req.file.originalname).name; // remove extension

        const bufferStream = Readable.from(req.file.buffer);

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'Rabbit_Store',
                public_id: originalName, // use original filename
                resource_type: 'auto', // detects image/video/etc
                use_filename: true,    // tells Cloudinary to use filename
                unique_filename: false // prevents Cloudinary from adding random string
            },
            (error, result) => {
                if (error) {
                    console.error('Upload error:', error);
                    return res.status(500).json({ success: false, message: 'Upload failed' });
                }

                res.status(200).json({ success: true, url: result.secure_url });
            }
        );

        bufferStream.pipe(uploadStream);
    } catch (err) {
        console.error('Upload failed:', err);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});


// router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: 'No file uploaded' });
//         }

//         const originalName = path.parse(req.file.originalname).name; // remove extension

//         // function to upload file
//         const fileUpload = async (file) => {
//             return new Promise((resolve, reject) => {
//                 const stream = cloudinary.uploader.upload_stream({
//                     folder: 'Rabbit_Store',
//                     public_id: originalName, // use original filename
//                     resource_type: 'auto', // detects image/video/etc
//                     use_filename: true,    // tells Cloudinary to use filename
//                     unique_filename: false // prevents Cloudinary from adding random string
//                 }, (error, result) => {
//                     if (error) {
//                         reject(error);
//                     } else {
//                         resolve(result);
//                     }
//                 })

//                 const bufferStream = Readable.from(file);
//                 bufferStream.pipe(stream);
//             });
//         }
//         // upload file to cloudinary
//         const result = await fileUpload(req.file.buffer);
//         res.status(200).json({ success: true, imageUrl: result.secure_url });
//     } catch (err) {
//         console.error('Upload failed:', err);
//         res.status(500).json({ success: false, message: 'Upload failed' });
//     }
// })


// Multer config (temporary local storage)
// const upload = multer({ dest: 'uploads/' });

// POST /upload - support both single and multiple files
// router.post('/', upload.any(), async (req, res) => {
//     try {
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ success: false, message: 'No files uploaded' });
//         }

//         const uploadPromises = req.files.map(async (file) => {
//             return cloudinary.uploader.upload(file.path, {
//                 folder: 'my_uploads',
//             }).then(result => {
//                 fs.unlinkSync(file.path); // Remove temp file
//                 return result.secure_url;
//             });
//         });

//         const urls = await Promise.all(uploadPromises);
//         res.status(200).json({ success: true, urls });
//     } catch (err) {
//         console.error('Upload failed:', err);
//         res.status(500).json({ success: false, message: 'Upload failed' });
//     }
// });

// Single file upload route
// router.post('/single', upload.single('file'), async (req, res) => {

//     console.log("file########################", req.file)
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: 'No file uploaded' });
//         }

//         const result = await cloudinary.uploader.upload(req.file.path, {
//             folder: 'my_uploads',
//         });
//         console.log("result@@@@@@@@@@@@@@@@@@@@", result)

//         fs.unlinkSync(req.file.path); // delete temp file

//         res.status(200).json({ success: true, url: result.secure_url });
//     } catch (err) {
//         console.error('Single file upload failed:', err);
//         res.status(500).json({ success: false, message: 'Upload failed' });
//     }
// });


export default router;
