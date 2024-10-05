import CommentId from "../../../../models/commentId";
import connectDb from "../../../../utils/connectDb";

export async function GET(req, { params }) {
    try {
        await connectDb();
        const data = await CommentId.find(
            { postId: params.id },
            { id: 0, email: 0, password: 0 } 
        ).sort({ createdAt: -1 });
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
