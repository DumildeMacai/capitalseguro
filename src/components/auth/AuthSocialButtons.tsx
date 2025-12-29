import { Button } from "@/components/ui/button";
import { SiFacebook, SiGoogle } from "react-icons/si";

export const AuthSocialButtons = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" type="button" className="h-11">
        <SiGoogle className="mr-2 h-4 w-4 text-[#EA4335]" />
        Google
      </Button>
      
      <Button variant="outline" type="button" className="h-11">
        <SiFacebook className="mr-2 h-4 w-4 text-[#1877F2]" />
        Facebook
      </Button>
    </div>
  );
};
