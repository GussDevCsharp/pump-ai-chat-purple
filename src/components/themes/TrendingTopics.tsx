
import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  usage_count?: number;
  created_at?: string;
}

interface TrendingTopicsProps {
  latestTopics: Topic[];
  popularTopics: Topic[];
}

export const TrendingTopics = ({ latestTopics }: TrendingTopicsProps) => {
  return (
    <div className="w-full">
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-pump-purple" />
          <h2 className="text-xl font-semibold text-gray-900">Últimas Atualizações</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Adicionado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {latestTopics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell>{topic.title}</TableCell>
                <TableCell>{new Date(topic.created_at!).toLocaleDateString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

