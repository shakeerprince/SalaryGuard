import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET - Fetch user's salary config
export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const config = await prisma.salaryConfig.findUnique({
            where: { userId: session.user.id }
        })

        return NextResponse.json(config)
    } catch (error) {
        console.error("Error fetching salary config:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// POST - Create or update salary config
export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { amount, payDay, balance } = await request.json()

        if (!amount || !payDay) {
            return NextResponse.json(
                { error: "Amount and payday are required" },
                { status: 400 }
            )
        }

        const config = await prisma.salaryConfig.upsert({
            where: { userId: session.user.id },
            update: {
                amount: parseFloat(amount),
                payDay: parseInt(payDay),
                balance: parseFloat(balance) || 0
            },
            create: {
                amount: parseFloat(amount),
                payDay: parseInt(payDay),
                balance: parseFloat(balance) || 0,
                userId: session.user.id
            }
        })

        return NextResponse.json(config)
    } catch (error) {
        console.error("Error saving salary config:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
