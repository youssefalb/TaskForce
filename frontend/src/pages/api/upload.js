// pages/api/upload.js
import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary with your credentials
cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        const { files, fields } = data;
        console.log('fields', fields);
        console.log('files', files);
        const fileKey = Object.keys(files)[0];
        const file = files[fileKey][0];

        if (!fs.existsSync(file.filepath)) {
            throw new Error('File not found at path: ' + file.filepath);
        }

        const filename = path.parse(file.originalFilename).name;

        const ticketId = fields.ticketId;
        console.log('ticketId', ticketId);
        if (ticketId) {
            const folderPath = `tickets/${ticketId}`;

            cloudinary.v2.uploader.upload(file.filepath,
                {
                    resource_type: 'auto',
                    public_id: `${folderPath}/${filename}`
                },
                function (error, result) {
                    if (error) {
                        return res.status(500).json({ error: 'Error uploading file', details: error });
                    }

                    res.status(200).json({ url: result.secure_url });
                }
            );
        }
        else {
            cloudinary.v2.uploader.upload(file.filepath,
                {
                    resource_type: 'auto',
                    public_id: `images/${filename}`
                },
                function (error, result) {
                    if (error) {
                        return res.status(500).json({ error: 'Error uploading file', details: error });
                    }

                    res.status(200).json({ url: result.secure_url });
                }
            );
        }



    } catch (error) {
        console.error('Error processing the upload:', error);
        res.status(500).json({ error: 'Error processing the upload', details: error.message });
    }
}
