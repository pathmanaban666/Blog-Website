import registerModel from "../../../models/registerModel";
import connectDb from "../../../utils/connectDb";
import { jwtVerify } from 'jose';
export async function POST(req) {
  try {
    const data = await req.json();
    const username = data.formData.username;
    const bio = data.formData.bio;
    const token = req.cookies.get('myCookie')?.value; 
    if (!token) {
        return new Response(JSON.stringify({ message: "User not authenticated" }), { status: 401 });
    }
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT);
    const { payload } = await jwtVerify(token, secret);
    const id = payload.userId;
    await connectDb();
    const updatedUser = await registerModel.findOneAndUpdate(
      { _id: id },
      { $set: { username: username, bio: bio } },
      { new: true, select: { _id: 0, email: 0, password: 0, __v: 0 } }
    );
    return new Response(JSON.stringify({ updatedUser, message: 'Updated Successfully' }), { status: 200 });
  } catch (error) {
    console.error(error); 
    return new Response(JSON.stringify({ message: 'Something Went Wrong.Try Later' }), { status: 401 });
  }
}