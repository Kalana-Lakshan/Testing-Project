import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { editUser, type User } from "@/services/userService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Roles } from "../Authentication/staff-sign-up";
import { Switch } from "@/components/ui/switch";

interface ViewUserProps {
  isOpen: boolean;
  selectedUser: User | null;
  onFinished: () => void;
  onClose: () => void;
}

const ViewUser: React.FC<ViewUserProps> = ({
  isOpen,
  selectedUser,
  onFinished,
  onClose,
}) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setUsername(selectedUser.username);
      setRole(selectedUser.role);
      setBranch(selectedUser.branch_name || "");
      setIsApproved(selectedUser.is_approved);
      setIsEditing(false); // reset to view mode
    }
  }, [selectedUser]);

  const handleUpdate = async () => {
    if (!selectedUser) return;
    toast.loading("Updating user...");

    try {
      const data = {
        user_id: selectedUser.user_id,
        role: role,
        // branch_id: branch,
        is_approved: isApproved,
      }
      await editUser(data)
      toast.success("User updated successfully.");
      onFinished();
      onClose();
    } catch (error) {
      toast.error("Failed to update user.");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit the user information below."
              : "Viewing user details. Click edit to make changes."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Username */}
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              disabled={true}
            />
          </div>

          {/* Role */}
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            {isEditing ? (
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue>
                    {Roles.find((r) => r.value === role)?.label || "Unknown role"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input id="role" value={role} disabled />
            )}
          </div>

          {/* Branch */}
          <div className="grid gap-2">
            <Label htmlFor="branch">Branch</Label>
            <Input
              id="branch"
              value={branch}
              disabled={!isEditing}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="is_approved">Approved</Label>
            <Switch
              id="is_approved"
              checked={isApproved}
              onCheckedChange={setIsApproved}
              disabled={!isEditing}
            />
          </div>
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUser;
