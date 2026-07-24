import { Button } from "@/components/ui/button";

export function SecuritySettings() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-[#4a2c1a]">Password</h3>

        <p className="text-sm text-[#8b5e34]">
          Update your password regularly to keep your account secure.
        </p>
      </div>

      <Button
        className="
          bg-[#8b5e34]
          hover:bg-[#6d451f]
        "
      >
        Change Password
      </Button>
    </div>
  );
}
