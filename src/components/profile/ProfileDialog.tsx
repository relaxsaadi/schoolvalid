
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileData {
  name: string;
  institutionName: string;
  logoUrl: string;
}

interface ProfileDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  onSave: () => void;
}

export function ProfileDialog({ 
  isOpen, 
  setIsOpen, 
  profileData, 
  setProfileData, 
  onSave 
}: ProfileDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="institution" className="text-right">
              Institution
            </Label>
            <Input
              id="institution"
              value={profileData.institutionName}
              onChange={(e) => setProfileData({ ...profileData, institutionName: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logo" className="text-right">
              Logo URL
            </Label>
            <Input
              id="logo"
              value={profileData.logoUrl}
              onChange={(e) => setProfileData({ ...profileData, logoUrl: e.target.value })}
              className="col-span-3"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
