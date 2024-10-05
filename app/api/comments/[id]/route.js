import registerModel from "@/models/registerModel";
import CommentId from "../../../../models/commentId";
import connectDb from "../../../../utils/connectDb";
import { jwtVerify } from 'jose';

export async function POST(req, { params }) {
    try {
        const token = req.cookies.get('myCookie')?.value;
        if (!token) {
            return new Response(JSON.stringify({ message: "User not authenticated" }), { status: 401 });
        }
        const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT);
        const { payload } = await jwtVerify(token, secret); 
        const id = payload.userId; 
        const commentJson = await req.json();
        const postId = params.id;
        const comment = commentJson.comments.comments;

        const user = await registerModel.findOne({ _id: id });
        if (!user) { 
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 }); 
        }

        const username = user.username;
        const commentId = { id, postId, username, comment };
        await connectDb();
        await CommentId.create(commentId);
        
        const commentResponse = { postId, username, comment };
        return new Response(JSON.stringify({ message: "Success", commentResponse }), { status: 201 }); 
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 }); 
    }
}