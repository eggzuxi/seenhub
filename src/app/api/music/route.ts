import {connectDB} from "../../../../lib/mongodb";
import {Music} from "../../../../models/Music";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const { title, artist, genre } = await req.json();
        await connectDB();

        const newMusic = new Music({ title, artist, genre });
        await newMusic.save();

        return NextResponse.json(newMusic);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "데이터 추가 실패" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const music = await Music.find(); // 모든 책 조회
        return NextResponse.json(music);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "데이터 조회 실패" }, { status: 500 });
    }
}