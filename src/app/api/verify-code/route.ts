import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const verifySchema = z.object({
  username: usernameValidation,
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.format()._errors.join(", ") || "Invalid input data",
        },
        { status: 400 }
      );
    }

    const { username, code } = result.data;
      
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date();

    if (isCodeValid && isCodeNotExpired) {
        user.isVerified = true;
        await user.save();

        return Response.json(
            {   
              success: true,
              message: "User verified successfully",
            },
            { status: 200 },
        );
    } 
    
    if (!isCodeNotExpired) {
        return Response.json(
            {
              success: false,
              message: "Verification code has expired. Please request a new one.",
            },
            { status: 400 },
        );
    } 
    
    return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 },
    );

  } catch (error) {
    console.error("Error Verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 },
    );
  }
}