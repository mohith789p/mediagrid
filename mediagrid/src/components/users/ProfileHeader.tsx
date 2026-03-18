import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  userId?: string;
  onSettingsClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userId,
  onSettingsClick,
}) => {
  const { currentUser, followUser, unfollowUser, uploadProfileImage } =
    useAuth();
  const { toast } = useToast();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isCurrentUser = !userId || userId === currentUser?.uid;
  const isFollowing = userId && currentUser?.following?.includes(userId);

  // If this is another user's profile, we need to fetch their data
  // For now, we'll just show the current user's data
  const profileUser = currentUser;

  const handleFollowToggle = async () => {
    if (!userId) return;

    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleImageClick = () => {
    if (isCurrentUser && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadProfileImage(file);
      toast({
        title: "Profile updated",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to update your profile picture.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="pb-6 space-y-6">
      <div className="h-40 bg-gradient-to-r from-mediagrid-purple/50 to-mediagrid-dark-purple/50 rounded-b-lg relative">
        <div className="absolute -bottom-12 left-6 flex items-end">
          <div className="relative" onClick={handleImageClick}>
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={profileUser?.photoURL || undefined} />
              <AvatarFallback>
                {getInitials(profileUser?.displayName ?? null)}
              </AvatarFallback>
            </Avatar>
            {isCurrentUser && (
              <div className="absolute bottom-0 right-0 bg-mediagrid-purple text-white rounded-full p-1 cursor-pointer">
                <Camera size={16} />
              </div>
            )}
          </div>
        </div>

        {isCurrentUser && (
          <div className="absolute top-4 right-4">
            <Button onClick={onSettingsClick} size="icon" variant="secondary">
              <Settings size={18} />
            </Button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="pt-12 px-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{profileUser?.displayName}</h1>
            <p className="text-muted-foreground">
              @{profileUser?.displayName?.toLowerCase().replace(/\s+/g, "")}
            </p>
          </div>

          {!isCurrentUser && (
            <Button
              onClick={handleFollowToggle}
              variant={isFollowing ? "outline" : "default"}
              className={isFollowing ? "" : "gradient-button"}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        <p className="text-foreground">{profileUser?.bio || "No bio yet."}</p>

        <div className="flex space-x-4 pb-2">
          <div>
            <span className="font-semibold">
              {profileUser?.followers?.length || 0}
            </span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </div>
          <div>
            <span className="font-semibold">
              {profileUser?.following?.length || 0}
            </span>{" "}
            <span className="text-muted-foreground">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
