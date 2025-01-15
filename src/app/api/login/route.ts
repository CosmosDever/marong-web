import { NextResponse } from "next/server";

const mockUser = {
    gmail: "test@example.com",
    password: "password123",
};

export async function POST(req: Request) {
    const { gmail, password } = await req.json();

    if (gmail === mockUser.gmail && password === mockUser.password) {
        return NextResponse.json({
            data: {
                token: [
                    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzM2MzA5NDIzLCJleHAiOjE3MzY5MTQyMjN9.ZrxlMNWd3mNxpunB87V3lMs4VKRsXeugdKvIwCN5lr1Ow6hhY_Je85sVqjIElIBiaaLT6vpzCEeS_nT1Vwcl4w",
                ],
            },
        });
    }

    return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
    );
}
