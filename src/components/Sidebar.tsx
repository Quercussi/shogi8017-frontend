"use client";

import React from 'react';

interface SidebarProps {
    userColor: string;
    currentTurn: string;
    onResign: () => void;
}

export default function Sidebar({ userColor, currentTurn, onResign }: SidebarProps) {
    return (
        <div className="w-1/6 bg-gray-100 p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">You are {userColor}.</h2>
            <p className="mb-2">Current Turn: {currentTurn}</p>
            <button onClick={onResign} className="px-4 py-2 bg-red-500 text-white rounded">
                Resign
            </button>
        </div>
    );
}
