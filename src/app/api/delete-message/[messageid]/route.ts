import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

type RouteParams = {
  params: {
    messageid: string;
  };
};

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  await dbConnect();

  // 💡 NEXT.JS DYNAMIC FIX: Promise behavior bypass framework alignment
  const resolvedParams = await Promise.resolve(params);
  const messageId = resolvedParams?.messageid;

  if (!messageId) {
    return Response.json(
      { success: false, message: "Message ID parameter is missing" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted from database" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting message route execution:", error);
    return Response.json(
      { success: false, message: "Internal server error during deletion" },
      { status: 500 }
    );
  }
}