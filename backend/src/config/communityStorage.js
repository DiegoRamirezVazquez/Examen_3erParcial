const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.COMMUNITY_SUPABASE_URL;
const supabaseKey = process.env.COMMUNITY_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Faltan las credenciales de Supabase Storage en el archivo .env"
    );
}

const communityStorage = createClient(
    supabaseUrl,
    supabaseKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);
module.exports = communityStorage;