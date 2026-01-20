'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";

export default function LogsAdminPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch<any>('/api/admin/monitoring/logs');
        setLogs(data?.logs || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao buscar logs",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [toast]);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Logs & Auditoria</CardTitle>
            <CardDescription>Consulte logs do sistema para depuração e análise.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="bg-muted p-4 rounded-md h-96 overflow-auto text-xs font-mono">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap">{log}</div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-16">Nenhum log encontrado.</p>
              )}
            </div>
          )}
        </CardContent>
    </Card>
  );
}
