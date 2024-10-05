import connectDb from "../../../utils/connectDb"
import registerModel from "../../../models/registerModel"
const bcryptjs = require('bcryptjs');
import CryptoJS from 'crypto-js';
export async function POST(req) {
    try {
        await connectDb();
        const { encryptedData } = await req.json();
        const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.NEXT_PUBLIC_SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const decryptedJson = JSON.parse(decrypted);
        const email = decryptedJson.email;
        const user = await registerModel.findOne({ email });
        if (!user) {
            const users = decryptedJson;
            users.password = await bcryptjs.hash(users.password, 10);
            const n3ew=await registerModel.create(users);
            return new Response(JSON.stringify({ message: "Registration successful! You can now log in with your email and password." }), { status: 201 });
        } else {
            return new Response(JSON.stringify({ message: "User Already Exists" }), { status: 409 });
        }      
    } catch (error) {
        return new Response(JSON.stringify({ message: "Registration failed." }), { status: 500 });
    }
}



