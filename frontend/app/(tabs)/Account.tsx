import { Session } from "@supabase/supabase-js";
import Account from "../../components/Account";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supa";

export default function AccountTab() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <Account session={session} />;
}
