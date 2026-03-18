"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/users/ProfileHeader";
import PostList from "@/components/posts/PostList";
import { PostType } from "@/components/posts/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/contexts/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserList from "@/components/users/UserList";
import { useToast } from "@/hooks/use-toast";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Add missing state variables
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);

  const userIdParam =
    params && typeof params.userId === "string"
      ? params.userId
      : params && Array.isArray(params.userId)
      ? params.userId[0]
      : undefined;
  const isCurrentUser = !userIdParam || userIdParam === currentUser?.uid;
  const profileId = userIdParam || currentUser?.uid;

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch profile
        if (profileId) {
          const userDoc = await getDoc(doc(db, "users", profileId));

          if (userDoc.exists()) {
            // Fetch followers
            const userFollowers = userDoc.data().followers || [];
            if (userFollowers.length > 0) {
              const followersQuery = query(
                collection(db, "users"),
                where("uid", "in", userFollowers)
              );
              const followersSnapshot = await getDocs(followersQuery);
              setFollowers(
                followersSnapshot.docs.map((doc) => doc.data() as UserProfile)
              );
            }

            // Fetch following
            const userFollowing = userDoc.data().following || [];
            if (userFollowing.length > 0) {
              const followingQuery = query(
                collection(db, "users"),
                where("uid", "in", userFollowing)
              );
              const followingSnapshot = await getDocs(followingQuery);
              setFollowing(
                followingSnapshot.docs.map((doc) => doc.data() as UserProfile)
              );
            }
          } else {
            toast({
              title: "User not found",
              description:
                "This user doesn't exist or has deleted their account.",
              variant: "destructive",
            });
            router.push("/");
          }

          // Fetch posts
          const postsQuery = query(
            collection(db, "posts"),
            where("authorId", "==", profileId),
            orderBy("createdAt", "desc")
          );

          const postsSnapshot = await getDocs(postsQuery);

          const fetchedPosts = postsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              authorId: data.authorId,
              authorName: data.authorName,
              authorImage: data.authorImage,
              content: data.content,
              mediaUrl: data.mediaUrl,
              mediaType: data.mediaType,
              createdAt: data.createdAt.toMillis(),
              likes: data.likes || [],
              comments: data.comments || 0,
            } as PostType;
          });

          setPosts(fetchedPosts);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser, router, profileId, params?.userId, toast]);

  const handleLikePost = async (postId: string) => {
    try {
      if (!currentUser) return;

      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);

      if (!post) return;
      await updateDoc(postRef, {
        likes: (post.likes || 0) + 1,
      });

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <MainLayout>
      {loading ? (
        <div className="animate-pulse space-y-8">
          <div className="h-40 bg-[var(--color-bg)] rounded-b-lg"></div>
          <div className="h-24 bg-[var(--color-bg)] rounded-lg"></div>
          <div className="h-60 bg-[var(--color-bg)] rounded-lg"></div>
        </div>
      ) : (
        <>
          <ProfileHeader
            userId={userIdParam}
            onSettingsClick={() => router.push("/settings")}
          />

          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl shadow-sm">
              <TabsTrigger
                value="posts"
                className="rounded-xl transition-colors font-medium data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-[var(--color-bg-secondary)] data-[state=active]:font-bold data-[state=inactive]:opacity-70"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="followers"
                className="rounded-xl transition-colors font-medium data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-[var(--color-bg-secondary)] data-[state=active]:font-bold data-[state=inactive]:opacity-70"
              >
                Followers
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="rounded-xl transition-colors font-medium data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-[var(--color-bg-secondary)] data-[state=active]:font-bold data-[state=inactive]:opacity-70"
              >
                Following
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">
                    No posts yet
                  </h3>
                  {isCurrentUser && (
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                      Create your first post to get started!
                    </p>
                  )}
                </div>
              ) : (
                <PostList posts={posts} onLike={handleLikePost} />
              )}
            </TabsContent>

            <TabsContent value="followers">
              <UserList users={followers} emptyMessage="No followers yet" />
            </TabsContent>

            <TabsContent value="following">
              <UserList
                users={following}
                emptyMessage="Not following anyone yet"
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </MainLayout>
  );
};

export default ProfilePage;
