// pages/api/upload.js
import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';

cloudinary.config({
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
    if (req.method === 'POST') {
        try {

            console.log('req', req);
            const data = await new Promise((resolve, reject) => {
                const form = new IncomingForm();
                form.parse(req, (err, fields, files) => {
                    if (err) return reject(err);
                    resolve(files);
                });
            });

            const file = data.file[0];
            const result = await cloudinary.uploader.upload(file.filepath);

            res.status(200).json({ url: result.secure_url });
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            res.status(500).json({ error: 'Error uploading image' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
