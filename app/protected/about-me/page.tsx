'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Replace with your actual Supabase URL and API key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AboutMeInterface() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [lookupId, setLookupId] = useState('');
    const [lookupResult, setLookupResult] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [latestId, setLatestId] = useState<number | null>(null);

    useEffect(() => {
        fetchLatestId();
    }, []);

    const fetchLatestId = async () => {
        try {
            const { data, error } = await supabase
                .from('about-me')
                .select('id')
                .order('id', { ascending: false })
                .limit(1)
                .single();

            if (error) throw error;

            setLatestId(data.id);
        } catch (error: any) {
            console.error('Error fetching latest ID:', error.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('about-me')
                .insert([{ question, answer }]);

            if (error) throw error;

            setMessage('Entry added successfully!');
            setQuestion('');
            setAnswer('');
            fetchLatestId();
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleLookup = async () => {
        try {
            const { data, error } = await supabase
                .from('about-me')
                .select('*')
                .eq('id', lookupId)
                .single();

            if (error) throw error;

            setLookupResult(data);
            setMessage('');
        } catch (error: any) {
            setLookupResult(null);
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Card className="mb-8 w-96">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Add New Entry</h2>
                    {latestId !== null && (
                        <p className="text-sm text-gray-500">Latest ID: {latestId}</p>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="question" className="block mb-2">Question:</label>
                            <Input
                                id="question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="answer" className="block mb-2">Answer:</label>
                            <Textarea
                                id="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Lookup by ID</h2>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <label htmlFor="lookupId" className="block mb-2">ID:</label>
                        <Input
                            id="lookupId"
                            type="number"
                            value={lookupId}
                            onChange={(e) => setLookupId(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleLookup}>Lookup</Button>
                </CardContent>
                {lookupResult && (
                    <CardFooter>
                        <div>
                            <p><strong>Question:</strong> {lookupResult.question}</p>
                            <p><strong>Answer:</strong> {lookupResult.answer}</p>
                        </div>
                    </CardFooter>
                )}
            </Card>

            {message && (
                <Alert>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}