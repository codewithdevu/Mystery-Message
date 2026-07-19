import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const userResult = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        // 💡 THE FIX: preserveNullAndEmptyArrays true karne se empty array parse ho jayega
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          // Empty state handling array elements filtering wrapper safely
          messages: { 
            $push: {
              $cond: {
                if: { $eq: ["$messages", {}] }, // check if structural object empty
                then: "$$REMOVE",
                else: "$messages"
              }
            } 
          },
        },
      },
    ]);

    // Agar real me hi user unique ID database me nahi mili tabhi 404 aayega
    if (!userResult || userResult.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        // userResult[0].messages agar null array setup elements pull up karega toh empty array fallback trigger ho jayega
        messages: userResult[0].messages.filter(Boolean).length > 0 ? userResult[0].messages : [],
      },
      { status: 200 },
    );  

  } catch (error) {
    return Response.json(
      { success: false, message: "Error fetching messages" },
      { status: 500 },
    );
  }
}