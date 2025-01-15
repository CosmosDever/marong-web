import { NextRequest, NextResponse } from "next/server";
import admin from "../../../assets/admin.png";

const mockAdminData = {
  data: [
    {
      id: 1,
      picture: admin,
      fullName: "Jane Doe",
      role: "ROLE_Admin",
    },
    {
        id: 2,
        picture: admin,
        fullName: "John Smith",
        role: "ROLE_Admin",
      },
    {
      id: 3,
      picture: admin,
      fullName: "Master Admin",
      role: "ROLE_master Admin",
    },
    {
        id: 4,
        picture: admin,
        fullName: "Jane Doe",
        role: "ROLE_Admin",
      },
      {
          id: 5,
          picture: admin,
          fullName: "John Smith",
          role: "ROLE_Admin",
        },
      {
        id: 6,
        picture: admin,
        fullName: "Master Admin",
        role: "ROLE_master Admin",
      },
  ],
  status: "success",
};

export async function GET(_: NextRequest) {
  return NextResponse.json(mockAdminData);
}
