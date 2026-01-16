'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShoppingCart, FileX, AlertTriangle, PlusCircle, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Ticket } from 'lucide-react';

const chartData = [
  { month: 'Jan', revenue: 186, orders: 80, income: 200 },
  { month: 'Fev', revenue: 305, orders: 90, income: 250 },
  { month: 'Mar', revenue: 237, orders: 120, income: 300 },
  { month: 'Abr', revenue: 73, orders: 190, income: 150 },
  { month: 'Mai', revenue: 209, orders: 130, income: 280 },
  { month: 'Jun', revenue: 314, orders: 140, income: 350 },
];

const chartConfig = {
  revenue: { label: 'Novos Pedidos', color: 'hsl(var(--chart-1))' },
  orders: { label: 'Pedidos Ativos', color: 'hsl(var(--chart-2))' },
  income: { label: 'Renda', color: 'hsl(var(--chart-3))' },
}

const shortcuts = [
    { label: "Adicionar Novo Cliente", icon: PlusCircle },
    { label: "Adicionar Novo Pedido", icon: PlusCircle },
    { label: "Abrir Novo Ticket", icon: PlusCircle },
    { label: "Gerar Faturas", icon: PlusCircle },
];

const activityLog = [
    { actor: 'Sistema', action: 'Cron de Sincronização de Domínio: Completo', time: '3 horas atrás' },
    { actor: 'Sistema', action: 'Tarefa Automatizada: Sincronização de Status de Domínio', time: '3 horas atrás' },
    { actor: 'Admin', action: 'Login bem-sucedido', time: '4 horas atrás' },
    { actor: 'Sistema', action: 'Backup diário completo', time: '8 horas atrás' },
];

const todoItems = [
    { text: "Renovar serviço para cliente 'Empresa X'", due: 'Vence em 11 meses', status: 'PENDENTE' },
    { text: "Verificar domínio 'meusite.com'", due: 'Vence em 9 meses', status: 'PENDENTE' },
    { text: "Fazer follow-up no Ticket #12345", due: '2 semanas atrás', status: 'ATRASADO' },
];

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Atalhos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ul className="space-y-1 p-2">
                        {shortcuts.map(item => (
                            <li key={item.label}>
                                <Button variant="ghost" className="w-full justify-start h-9">
                                    <item.icon className="mr-2 h-4 w-4 text-muted-foreground" /> {item.label}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Pesquisa Avançada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Clientes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="clients">Clientes</SelectItem>
                            <SelectItem value="orders">Pedidos</SelectItem>
                            <SelectItem value="invoices">Faturas</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input placeholder="Nome do cliente..." />
                    <Button className="w-full"><Search className="mr-2 h-4 w-4" /> Pesquisar</Button>
                </CardContent>
            </Card>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tickets Aguardando</CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">34</div>
                    <p className="text-xs text-muted-foreground">5 aguardando resposta do admin</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cancelamentos Pendentes</CardTitle>
                    <FileX className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3</div>
                </CardContent>
                </Card>
                 <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ações de Módulo</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1</div>
                     <p className="text-xs text-muted-foreground">Falha na criação de serviço</p>
                </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <Card>
                <CardHeader>
                    <CardTitle>Visão Geral do Sistema</CardTitle>
                    <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-3))" />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                        <Bar yAxisId="left" dataKey="orders" fill="var(--color-orders)" radius={4} />
                        <Bar yAxisId="right" dataKey="income" fill="var(--color-income)" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
                </Card>
            </div>

             <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Tarefas</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="space-y-4">
                            {todoItems.map(item => (
                                <li key={item.text} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">{item.text}</p>
                                        <p className="text-xs text-muted-foreground">{item.due}</p>
                                    </div>
                                    <Badge variant={item.status === 'ATRASADO' ? 'destructive' : 'secondary'}>{item.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Atividade do Cliente</CardTitle>
                    </CardHeader>
                     <CardContent className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">377</p>
                            <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-sm text-muted-foreground">Usuários Online</p>
                        </div>
                     </CardContent>
                </Card>
             </div>
             
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Log de Atividades</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ator</TableHead>
                                <TableHead>Ação</TableHead>
                                <TableHead className="text-right">Horário</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activityLog.map((log, index) => (
                                <TableRow key={index}>
                                    <TableCell>{log.actor}</TableCell>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground">{log.time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    </div>
  );
}
