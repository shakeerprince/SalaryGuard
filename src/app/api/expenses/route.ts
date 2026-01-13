import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET - Fetch user's expenses
export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const expenses = await prisma.expense.findMany({
            where: { userId: session.user.id },
            orderBy: { date: 'desc' }
        })

        return NextResponse.json(expenses)
    } catch (error) {
        console.error("Error fetching expenses:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// POST - Create new expense
export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { amount, category, description, type = "EXPENSE" } = await request.json()

        if (!amount || !category) {
            return NextResponse.json(
                { error: "Amount and category are required" },
                { status: 400 }
            )
        }

        const expense = await prisma.expense.create({
            data: {
                amount: parseFloat(amount),
                category,
                description,
                type,
                userId: session.user.id
            }
        })

        // Update balance if exists
        const config = await prisma.salaryConfig.findUnique({
            where: { userId: session.user.id }
        })

        if (config) {
            const delta = type === "EXPENSE" ? -amount : amount
            await prisma.salaryConfig.update({
                where: { userId: session.user.id },
                data: { balance: config.balance + delta }
            })
        }

        return NextResponse.json(expense)
    } catch (error) {
        console.error("Error creating expense:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
