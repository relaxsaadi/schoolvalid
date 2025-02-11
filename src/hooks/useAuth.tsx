
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      
      if (sessionError || !user) {
        navigate('/sign-in');
        return;
      }
    };

    checkSession();
  }, [navigate]);
};
