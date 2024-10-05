import contactModel from "../../../models/contactModel";
import connectDb from "../../../utils/connectDb";
import CryptoJS from 'crypto-js';

export async function POST(req) {
  try {
    const { encryptedData } = await req.json();
    const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.NEXT_PUBLIC_SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const contactData = JSON.parse(decrypted);
    await connectDb();
    await contactModel.create(contactData);
    return new Response(JSON.stringify({ message: "Sent successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
