import registerModel from "../../../models/registerModel";
import connectDb from "../../../utils/connectDb";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import cookie from 'cookie';

export async function POST(req) {
    try {
        await connectDb();
        const encryptedData = await req.json();
        const bytesEmail = CryptoJS.AES.decrypt(encryptedData.encryptedemail, process.env.NEXT_PUBLIC_SECRET_KEY);
        const decryptedEmail = bytesEmail.toString(CryptoJS.enc.Utf8);
        const email = JSON.parse(decryptedEmail); 
        const bytesPassword = CryptoJS.AES.decrypt(encryptedData.encryptedpassword, process.env.NEXT_PUBLIC_SECRET_KEY);
        const decryptedPassword = bytesPassword.toString(CryptoJS.enc.Utf8);
        const password = JSON.parse(decryptedPassword); 
        const user = await registerModel.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid Credentials' }), { status: 404 });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign(
                { userId: user._id, username: user.username, email: user.email },
                process.env.NEXT_PUBLIC_JWT,
                { expiresIn: '24h' }
            );
            const cookieOptions = {
                httpOnly: true,
                secure: false, 
                maxAge: 60 * 60, 
                path: '/', 
            };

            const setCookie = cookie.serialize('myCookie', token, cookieOptions);
            const responseHeaders = new Headers();
            responseHeaders.set('Set-Cookie', setCookie);
            responseHeaders.set('Content-Type', 'application/json');

            return new Response(JSON.stringify({ token, message: 'Logged in' }), {
                status: 200,
                headers: responseHeaders,
            });
        } else {
            return new Response(JSON.stringify({ message: 'Wrong Password' }), { status: 401 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 500 });
    }
}
