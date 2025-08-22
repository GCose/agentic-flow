// pages/api/auth/login.js
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface LoginRequestBody {
    email: string;
    password: string;
}

interface AuthServiceResponse {
    token: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    if (req.method === 'POST') {
        const { email, password } = req.body as LoginRequestBody;

        try {
            // Send request to your backend auth service
            const response = await axios.post<AuthServiceResponse>(
                `${process.env.AUTH_SERVICE_URL}/api/v1/auth/login`, 
                { email, password }
            );

            // Handle successful login response, e.g., return JWT token
            const { token } = response.data;

            // Store the token in a cookie or return to the frontend
            res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Secure`);
            return res.status(200).json({ message: 'Login successful' });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Authentication failed' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
