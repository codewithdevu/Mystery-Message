import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
      
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

    // Check if the code matches
    const isCodeValid = user.verifyCode === code;
    // If expiry time is in the future, the code is NOT expired
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
    
    // If the code is correct but time ran out
    if (!isCodeNotExpired) {
        return Response.json(
          {
            success: false,
            message: "Verification code has expired. Please request a new one.",
          },
          { status: 400 },
        );
    } 
    
    // If the code just doesn't match
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