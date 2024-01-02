import { NextApiRequest, NextApiResponse } from 'next';
import { getBCAuth } from '../../lib/auth';
 
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    try {
        // First, authorize the application
        // req.query: query param passed from the Control Panel to your app
        await getBCAuth(req.query);
        // Once the app has been authorized, redirect to the homepage (/pages/index.tsx)
        res.redirect(302, '/');
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}