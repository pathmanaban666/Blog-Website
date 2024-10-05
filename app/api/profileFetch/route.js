import registerModel from "../../../models/registerModel";
import connectDb from "../../../utils/connectDb";
import { jwtVerify } from 'jose';
export async function POST(req) {
  try {
    const token = req.cookies.get('myCookie')?.value; 
        if (!token) {
            return new Response(JSON.stringify({ message: "User not authenticated" }), { status: 401 });
        }
        const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT);
        const { payload } = await jwtVerify(token, secret); 
        const id = payload.userId; 
        await connectDb();
        const updatedUser = await registerModel
        .findOneAndUpdate(
          { _id: id },
          {},
          { new: true } 
        )
        .select('-_id -password -__v');
    return new Response(JSON.stringify({ updatedUser, message: 'Updated Successfully' }), { status: 200 });
  } catch (error) {
    console.error(error); 
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 401 });
  }
}