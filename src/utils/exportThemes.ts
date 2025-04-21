
import { supabase } from "@/integrations/supabase/client";

export const exportThemesToCSV = async () => {
  try {
    const { data, error } = await supabase
      .from('chat_themes')
      .select('name, description')
      .order('name');

    if (error) throw error;

    // Create CSV content with semicolon separator
    const csvContent = data
      .map(theme => `${theme.name};${theme.description || ''}`)
      .join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'chat_themes.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting themes:', error);
  }
};
