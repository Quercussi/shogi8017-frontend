"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { MoveAction } from '@/types/game';

interface PromotionToastProps {
    move: Omit<MoveAction, 'toPromote'>;
    makeMove: (payload: { move: MoveAction }) => void;
    dismissToast: () => void;
}

const PromotionToast: React.FC<PromotionToastProps> = ({ move, makeMove, dismissToast }) => {
    return (
        <div className="flex flex-col gap-2 p-4 bg-background border rounded-lg shadow-lg">
            <div className="font-semibold">Promote Piece?</div>
            <div className="flex gap-2 mt-2">
                <Button
                    size="sm"
                    onClick={() => {
                        makeMove({ move: { ...move, toPromote: true } });
                        dismissToast();
                    }}
                >
                    Yes
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        makeMove({ move: { ...move, toPromote: false } });
                        dismissToast();
                    }}
                >
                    No
                </Button>
            </div>
        </div>
    );
};

export default PromotionToast;
