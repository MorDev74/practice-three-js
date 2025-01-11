'use client';

import { useSearchParams } from 'next/navigation';

export default function SpecPage() {
    const searchParams = useSearchParams();
    
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Search Parameters</h1>
            
            <div className="space-y-4">
                {Array.from(searchParams.entries()).map(([key, value]) => (
                    <div key={key} className="border p-4 rounded-lg">
                        <p className="font-semibold">Key: {key}</p>
                        <p>Value: {value}</p>
                    </div>
                ))}
                
                {Array.from(searchParams.entries()).length === 0 && (
                    <p className="text-gray-500">No search parameters found</p>
                )}
            </div>
        </div>
    );
}
