import postModel from "../../../models/postModel";
import connectDb from "../../../utils/connectDb";

export async function GET() {
    try {
        await connectDb();
        const data = await postModel.find({}).limit(3);
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
