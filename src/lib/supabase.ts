import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kwnsfdtvlywajuwyibed.supabase.co';
const supabaseKey = 'sb_publishable_wSsInPnZIm-x5wmOwT1bbw_07kO1dCJ';

export const supabase = createClient(supabaseUrl, supabaseKey);
