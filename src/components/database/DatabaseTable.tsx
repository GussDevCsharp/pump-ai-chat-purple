
import React from 'react';
import { TableField } from './TableField';

interface DatabaseTableProps {
  name: string;
  fields: Array<{
    name: string;
    type: string;
    nullable: boolean;
    default_value?: string | null;
  }>;
}

export const DatabaseTable: React.FC<DatabaseTableProps> = ({ name, fields }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700">{name}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {fields.map((field) => (
          <TableField
            key={field.name}
            name={field.name}
            type={field.type}
            nullable={field.nullable}
            default_value={field.default_value}
          />
        ))}
      </div>
    </div>
  );
};
