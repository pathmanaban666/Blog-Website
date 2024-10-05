import postModel from "../../../../models/postModel";
import connectDb from "../../../../utils/connectDb";

export async function GET(req, { params }) {
    try {
        await connectDb();
        const data = await postModel.findOne({ _id: params.id });
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return Response.redirect('/404', 302);
    }
}