import registerModel from "../../../models/registerModel";
import connectDb from "../../../utils/connectDb";
import CryptoJS from 'crypto-js';
const bcryptjs = require('bcryptjs');
import { jwtVerify } from 'jose';

export async function POST(req) {
  const data = await req.json();
  try {
        const token = req.cookies.get('myCookie')?.value; 
        if (!token) {
            return new Response(JSON.stringify({ message: "User not authenticated" }), { status: 401 });
        }
        const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT);
        const { payload } = await jwtVerify(token, secret);
        const id = payload.userId;
        const encryptedPassword = data.encryptedPassword;
        const bytesPassword = CryptoJS.AES.decrypt(encryptedPassword, process.env.NEXT_PUBLIC_SECRET_KEY);
        const decryptedPassword = bytesPassword.toString(CryptoJS.enc.Utf8);
        const passwordData = JSON.parse(decryptedPassword);
        await connectDb();
        const user = await registerModel.findOne({ _id: id });
        if (!user) {
          return new Response(JSON.stringify({ message: 'Invalid Credentials' }), { status: 404 });
        } else {
          const isPasswordCorrect = await bcryptjs.compare(passwordData.oldPassword, user.password);
          if (isPasswordCorrect) {
            const hashedNewPassword = await bcryptjs.hash(passwordData.newPassword, 10);
            await registerModel.findOneAndUpdate(
              { _id: id },
              { $set: { password: hashedNewPassword } },
              { new: true }
            );
            return new Response(JSON.stringify({ message: 'Password changed successfully' }), { status: 200 });
          } else {
            return new Response(JSON.stringify({ message: 'You have entered wrong old password' }), { status: 401 });
          }
        }
       } catch (error) {
          console.error(error); 
          return new Response(JSON.stringify({ message: 'Something Went Wrong.Try Later' }), { status: 500 });
        }
}
