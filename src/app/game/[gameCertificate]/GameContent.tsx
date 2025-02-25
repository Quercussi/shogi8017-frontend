"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {useParams} from "next/navigation";

export default function GameContent() {
    const { gameCertificate } = useParams();

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Game Certificate</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center text-lg font-semibold">
                    {gameCertificate}
                </div>
            </CardContent>
        </Card>
    );
}