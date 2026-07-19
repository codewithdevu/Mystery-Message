import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    // Database se user find karein
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 💡 CONFIRMED KEY: Hamare schema me strictly 'isAcceptingMessage' hai
    if (user.isAcceptingMessage === false) {
      return Response.json(
        { 
          success: false, 
          message: "Please accept the message option first! The user is not accepting messages." 
        },
        { status: 403 }
      );
    }

    // Message object structural alignment
    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      content,
      createdAt: new Date()
    };

    user.messages.push(newMessage as any); 
    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { success: false, message: "Error sending message" },
      { status: 500 }
    );
  }
}