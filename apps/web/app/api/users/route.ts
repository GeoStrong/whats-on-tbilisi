import { UserProfile } from "@/lib/types";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

type FullUserInfoType = Partial<UserProfile> & {
  additional_info?: string;
};

export const GET = async () => {
  return NextResponse.json({ message: "User route" }, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const data: FullUserInfoType = await request.json();
  const filePath = path.join(process.cwd(), "data", "users.json");
  const fileData = fs.readFileSync(filePath);
  const users = JSON.parse(fileData.toString());

  if (users.find((user: FullUserInfoType) => user.email === data.email)) {
    return NextResponse.json(
      { message: "User already exists" },
      {
        status: 400,
        statusText: "User already exists",
      },
    );
  } else {
    users.push({
      id: crypto.randomUUID(),
      ...data,
    });
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    return NextResponse.json({ message: "User created" }, { status: 200 });
  }
};
