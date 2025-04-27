
import React from 'react';

interface TableFieldProps {
  name: string;
  type: string;
  nullable: boolean;
  default_value?: string | null;
}

export const TableField: React.FC<TableFieldProps> = ({ name, type, nullable, default_value }) => {
  return (
    <div className="py-2 px-4 border-b border-gray-100 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{name}</span>
          {!nullable && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">required</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{type}</span>
          {default_value && (
            <span className="text-xs text-gray-400">
              default: {default_value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
