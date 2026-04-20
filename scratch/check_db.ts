import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjects() {
  const { data, count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact' });
  
  if (error) {
    console.error("Error fetching projects:", error);
    return;
  }

  console.log(`Total projects in DB: ${count}`);
  if (data && data.length > 0) {
    console.log("Column names in DB:", Object.keys(data[0]));
    data.forEach(p => {
      console.log(`- [${p.is_featured ? "FEATURED" : "HIDDEN"}] ${p.title} (thumbnail: "${p.thumbnail_url}")`);
    });
  }
}

checkProjects();
