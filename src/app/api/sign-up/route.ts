import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"; 

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // 1. Check karein agar username pehle se kisi verified user ne liya hua hai
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // 2. Check karein agar email pehle se registered hai
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      // TODO: Agar email exist karta hai par verified nahi hai, toh yahan logic add kar sakte hain.
      // Abhi ke liye duplicate error handle kiya hai:
      return NextResponse.json(
        {
          success: false,
          message: "Email is already registered",
        },
        { status: 400 }
      );
    } else {
      // 3. Naya user create karein agar email nahi milta
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpires: expiryDate,
        isAcceptingMessages: true,
        isVerified: false,
        messages: [],
      });

      await newUser.save();
    }

    // 4. Verification Email Send Karein
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    // Agar Resend API se email bhejna fail ho jaye
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message || "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    // 5. Success Response
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error registering user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}