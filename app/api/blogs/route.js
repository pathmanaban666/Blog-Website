import postModel from "../../../models/postModel";
import connectDb from "../../../utils/connectDb";

export async function GET() { 
    try { 
        await connectDb();
        const data = await postModel.find({});
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}


