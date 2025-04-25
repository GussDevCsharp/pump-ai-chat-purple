
import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, News } from "lucide-react";

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

export const TrendingTopics = ({ latestTopics, popularTopics }: TrendingTopicsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {/* Coluna Novidades */}
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <News className="w-5 h-5 text-pump-purple" />
          <h2 className="text-xl font-semibold text-gray-900">Novidades</h2>
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

      {/* Coluna Hype */}
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-pump-purple" />
          <h2 className="text-xl font-semibold text-gray-900">Hype</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Utilizações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {popularTopics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell>{topic.title}</TableCell>
                <TableCell>{topic.usage_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
