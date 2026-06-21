import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getNativeBalance } from "@/features/web3/onchain";

const syncInputSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.number().int().positive(),
});

type SyncState = {
  address: string;
  chainId: number;
  nativeBalance: string;
  lastSyncedAt: number;
};

const syncStore = new Map<string, SyncState>();

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = syncInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid sync payload." }, { status: 400 });
  }

  const normalizedAddress = parsed.data.address as `0x${string}`;
  const nativeBalance = await getNativeBalance(normalizedAddress, parsed.data.chainId);

  const state: SyncState = {
    address: parsed.data.address,
    chainId: parsed.data.chainId,
    nativeBalance,
    lastSyncedAt: Date.now(),
  };

  syncStore.set(parsed.data.address.toLowerCase(), state);

  return NextResponse.json({ state });
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Address query param is required." }, { status: 400 });
  }

  const state = syncStore.get(address.toLowerCase()) ?? null;
  return NextResponse.json({ state });
}