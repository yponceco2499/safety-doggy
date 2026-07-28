// Safety Doggy — delete-account Edge Function
//
// Deletes the calling user's Supabase Auth credentials. This is the piece
// account deletion was missing: the client (mobile/src/lib/profile.ts)
// can anonymize/soft-delete rows it has permission to touch, but removing
// an auth.users row requires the service_role key, which must never ship
// in the app — hence a server-side function.
//
// Deleting the auth.users row cascades in Postgres per the FK constraints
// already defined in the schema:
//   - public.profiles, public.pets, public.walks  -> "on delete cascade"  (removed)
//   - public.flags                                 -> "on delete cascade"  (removed)
//   - public.reports.user_id                        -> "on delete set null" (anonymized, kept)
// So this function does nothing beyond the delete itself — no manual
// per-table cleanup needed, and no risk of a partially-applied deletion.

import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Identify the caller from their own JWT — never trust a user id passed
  // in the request body, so this can only ever delete the caller's own account.
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: userError,
  } = await callerClient.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
