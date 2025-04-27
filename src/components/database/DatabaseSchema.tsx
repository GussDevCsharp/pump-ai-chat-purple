
import React from 'react';
import { DatabaseTable } from './DatabaseTable';

const tables = [
  {
    name: "chat_themes",
    fields: [
      { name: "id", type: "uuid", nullable: false, default_value: "gen_random_uuid()" },
      { name: "color", type: "text", nullable: true, default_value: null },
      { name: "name", type: "text", nullable: false },
      { name: "description", type: "text", nullable: true }
    ]
  },
  {
    name: "chat_sessions",
    fields: [
      { name: "id", type: "uuid", nullable: false, default_value: "gen_random_uuid()" },
      { name: "theme_id", type: "uuid", nullable: true },
      { name: "title", type: "text", nullable: false },
      { name: "card_theme", type: "text", nullable: true },
      { name: "created_at", type: "timestamp with time zone", nullable: false, default_value: "now()" },
      { name: "user_id", type: "uuid", nullable: false },
      { name: "card_title", type: "text", nullable: true },
      { name: "updated_at", type: "timestamp with time zone", nullable: false, default_value: "now()" }
    ]
  },
  {
    name: "chat_messages",
    fields: [
      { name: "id", type: "uuid", nullable: false, default_value: "gen_random_uuid()" },
      { name: "session_id", type: "uuid", nullable: false },
      { name: "content", type: "text", nullable: false },
      { name: "role", type: "text", nullable: false },
      { name: "created_at", type: "timestamp with time zone", nullable: false, default_value: "now()" }
    ]
  },
  {
    name: "theme_prompts",
    fields: [
      { name: "id", type: "uuid", nullable: false, default_value: "gen_random_uuid()" },
      { name: "theme_id", type: "uuid", nullable: false },
      { name: "title", type: "text", nullable: false },
      { name: "prompt_furtive", type: "text", nullable: true },
      { name: "action_plan", type: "boolean", nullable: true, default_value: "false" },
      { name: "created_at", type: "timestamp with time zone", nullable: false, default_value: "now()" },
      { name: "updated_at", type: "timestamp with time zone", nullable: false, default_value: "now()" }
    ]
  },
  {
    name: "company_profiles",
    fields: [
      { name: "id", type: "uuid", nullable: false, default_value: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false },
      { name: "company_name", type: "text", nullable: false },
      { name: "business_segment", type: "text", nullable: true },
      { name: "employees_count", type: "integer", nullable: true },
      { name: "average_revenue", type: "numeric", nullable: true },
      { name: "profile_completed", type: "boolean", nullable: true, default_value: "false" },
      { name: "created_at", type: "timestamp with time zone", nullable: true, default_value: "now()" },
      { name: "updated_at", type: "timestamp with time zone", nullable: true, default_value: "now()" }
    ]
  }
];

export const DatabaseSchema: React.FC = () => {
  return (
    <div className="py-8 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Estrutura do Banco de Dados</h1>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {tables.map((table) => (
            <DatabaseTable
              key={table.name}
              name={table.name}
              fields={table.fields}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
