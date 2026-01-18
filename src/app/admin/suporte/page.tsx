'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SupportAdminPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Tickets de Suporte</CardTitle>
                    <CardDescription>Gerencie tickets de suporte, departamentos e automações.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar tickets..." className="pl-8" />
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Ticket
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                    <p>O sistema de tickets de suporte está em desenvolvimento.</p>
                </div>
            </CardContent>
        </Card>
    );
}
