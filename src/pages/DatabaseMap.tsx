
import React from 'react';
import { Header } from "@/components/common/Header";
import { DatabaseSchema } from '@/components/database/DatabaseSchema';

export default function DatabaseMap() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <DatabaseSchema />
    </div>
  );
}
