import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbconnect();

  const session = await getServerSession(authOptions);

  const user = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const userId = user._id;
  const { acceptedMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptedMessages: acceptedMessages },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Accepted messages updated successfully",
        data: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("failed to update accepted messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update accepted messages",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  await dbconnect();

  const session = await getServerSession(authOptions);

  const user = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("failed to retrieve accepted messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to retrieve accepted messages",
      },
      { status: 500 },
    );
  }
}
