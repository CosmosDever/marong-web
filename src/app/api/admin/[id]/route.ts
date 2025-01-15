import { NextRequest, NextResponse } from "next/server";
import admin from "../../../assets/admin.png";

// Mock data
const mockAdminData = [
  {
    id: 1,
    picture: "/assets/admin.png",
    fullName: "Jane Doe",
    gmail: "admin@example.com",
    password: "$2a$10$WWIIXVeEp84wH8RqbM0Z1.jycfkQOaEnkA/U1SUIVZDJ0258lHa2e",
    birthday: "1990-01-01",
    gender: "Male",
    telephone: "849874867",
    role: "ROLE_Admin",
  },
  {
    id: 2,
    picture: admin,
    fullName: "John Smith",
    gmail: "john@example.com",
    password: "$2a$10$WWIIXVeEp84wH8RqbM0Z1.jycfkQOaEnkA/U1SUIVZDJ0258lHa2e",
    birthday: "1995-02-01",
    gender: "Female",
    telephone: "849874123",
    role: "ROLE_Admin",
  },
  {
    id: 3,
    picture: admin,
    fullName: "Master Admin",
    gmail: "masteradmin@example.com",
    password: "$2a$10$WWIIXVeEp84wH8RqbM0Z1.jycfkQOaEnkA/U1SUIVZDJ0258lHa2e",
    birthday: "1990-02-01",
    gender: "Male",
    telephone: "849874144",
    role: "ROLE_master Admin",
  },
  {
    id: 4,
    picture: "/assets/admin.png",
    fullName: "Jane Doe",
    gmail: "admin@example.com",
    password: "$2a$10$WWIIXVeEp84wH8RqbM0Z1.jycfkQOaEnkA/U1SUIVZDJ0258lHa2e",
    birthday: "1990-01-01",
    gender: "Male",
    telephone: "849874867",
    role: "ROLE_Admin",
  },
  {
    id: 5,
    picture: admin,
    fullName: "John Smith",
    gmail: "john@example.com",
    password: "$2a$10$WWIIXVeEp84wH8RqbM0Z1.jycfkQOaEnkA/U1SUIVZDJ0258lHa2e",
    birthday: "1995-02-01",
    gender: "Female",
    telephone: "849874123",
    role: "ROLE_Admin",
  },
  {
    id: 6,
    picture: admin,
    fullName: "Master Admin",
    gmail: "masteradmin@example.com",
    password: "$2a$10$WWIIXVeEp84wH8RqbM0Z1.jycfkQOaEnkA/U1SUIVZDJ0258lHa2e",
    birthday: "1990-02-01",
    gender: "Male",
    telephone: "849874144",
    role: "ROLE_master Admin",
  },
];

interface Params {
  id: string;
}


export async function GET(req: NextRequest, context: { params: Params }) {
  const { id } = await context.params;

  const numericId = parseInt(id, 10);

  const user = mockAdminData.find((admin) => admin.id === numericId);

  if (!user) {
    return NextResponse.json(
      { status: "error", message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ status: "success", data: user });
}
