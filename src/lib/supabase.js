import { createClient } from '@supabase/supabase-js'

// Note: In production, these should be environment variables
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)