import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const txIntentSchema = z.object({
  account: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  message: z.string().min(10),
  signature: z.string().min(20),
  issuedAt: z.number().int().positive(),
});

type RelayedTransaction = {
  id: string;
  account: string;
  status: "queued" | "simulated";
  createdAt: number;
};

const relayedTransactions: RelayedTransaction[] = [];

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = txIntentSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid transaction intent." }, { status: 400 });
  }

  const relayedTransaction: RelayedTransaction = {
    id: crypto.randomUUID(),
    account: parsed.data.account,
    status: "queued",
    createdAt: Date.now(),
  };

  relayedTransactions.unshift(relayedTransaction);

  return NextResponse.json({
    tx: { ...relayedTransaction, status: "simulated" },
    note: "Intent accepted by relayer simulator. Replace with signed transaction broadcast in production.",
  });
}

export async function GET() {
  return NextResponse.json({
    transactions: relayedTransactions.slice(0, 25),
  });
}