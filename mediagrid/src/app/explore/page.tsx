"use client";

import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PostList from "@/components/posts/PostList";
import UserList from "@/components/users/UserList";
import { PostType } from "@/components/posts/PostCard";
import { useAuth, UserProfile } from "@/contexts/AuthContext";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const demoTrendingPosts: PostType[] = [
  {
    id: "demo1",
    authorId: "demoUserA",
    authorName: "Alice Demo",
    authorImage: "https://api.slingacademy.com/public/sample-photos/12.jpeg",
    content: "Check out this awesome demo post! 🚀",
    mediaUrl: "https://api.slingacademy.com/public/sample-photos/13.jpeg",
    mediaType: "image",
    createdAt: Date.now(),
    likes: 3,
    comments: 3,
  },
];

const demoSuggestedUsers: UserProfile[] = [
  {
    uid: "demoUserA",
    displayName: "Alice Demo",
    photoURL: "https://api.slingacademy.com/public/sample-photos/12.jpeg",
    email: "alice.demo@example.com",
    following: [],
    followers: [],
  },
];

const ExplorePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [trendingPosts, setTrendingPosts] = useState<PostType[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setTrendingPosts(demoTrendingPosts);
      setSuggestedUsers(demoSuggestedUsers);
      setLoading(false);
      return;
    }

    const fetchExploreData = async () => {
      try {
        setLoading(true);

        const postsQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const postsSnapshot = await getDocs(postsQuery);

        const postsWithAuthors: PostType[] = [];
        for (const postDoc of postsSnapshot.docs) {
          const postData = postDoc.data();
          const ownerId = postData.ownerId;

          const userDocRef = doc(db, "users", ownerId);
          const userDocSnap = await getDoc(userDocRef);

          const authorData = userDocSnap.exists() ? userDocSnap.data() : null;

          postsWithAuthors.push({
            id: postDoc.id,
            authorId: ownerId,
            authorName: authorData?.displayName || "Unknown",
            authorImage: authorData?.photoURL || "",
            content: postData.captions || "",
            mediaUrl: postData.mediaURL || "",
            mediaType: postData.mediaType || "image",
            createdAt: postData.createdAt?.toMillis
              ? postData.createdAt.toMillis()
              : postData.createdAt || Date.now(),
            likes: postData.likes || 0,
            comments: postData.commentCount || 0,
          });
        }

        postsWithAuthors.sort((a, b) => b.likes - a.likes);
        setTrendingPosts(postsWithAuthors);

        const currentFollowing = currentUser.following || [];

        const usersQuery = query(collection(db, "users"), limit(50));
        const usersSnapshot = await getDocs(usersQuery);

        const usersList: UserProfile[] = usersSnapshot.docs
          .map((doc) => doc.data() as UserProfile)
          .filter(
            (user) =>
              user.uid !== currentUser.uid &&
              !currentFollowing.includes(user.uid)
          );

        setSuggestedUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching explore data:", error);
        toast({
          title: "Error",
          description: "Failed to load explore data.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchExploreData();
  }, [currentUser, toast]);

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, limit(20));
      const snapshot = await getDocs(q);
      const users = snapshot.docs
        .map((doc) => doc.data() as UserProfile)
        .filter(
          (user) =>
            user.displayName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      setSearchResults(users);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, handleSearch]);

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      toast({
        title: "Login required",
        description: "Please log in to like posts.",
      });
      return;
    }

    toast({
      title: "Liked!",
      description: `You liked post ${postId}`,
    });
  };

  return (
    <MainLayout>
      <Tabs defaultValue="trending" className="space-y-4 max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-2 mb-8 bg-muted border border-border rounded-xl shadow-sm">
          <TabsTrigger
            value="trending"
            className="rounded-xl transition-colors font-medium
                   data-[state=active]:bg-[#2563eb] data-[state=active]:text-white
                   data-[state=active]:font-bold data-[state=inactive]:opacity-70"
          >
            Trending Posts
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="rounded-xl transition-colors font-medium
                   data-[state=active]:bg-[#2563eb] data-[state=active]:text-white
                   data-[state=active]:font-bold data-[state=inactive]:opacity-70"
          >
            Suggested Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-60 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-60 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ) : (
            <PostList posts={trendingPosts} onLike={handleLike} />
          )}
        </TabsContent>

        <TabsContent value="users">
          <div className="mb-4 relative max-w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onBlur={handleSearch}
              className="pl-10"
              autoComplete="off"
            />
          </div>

          {searching ? (
            <div>Searching users...</div>
          ) : searchQuery.trim() ? (
            searchResults.length > 0 ? (
              <UserList users={searchResults} />
            ) : (
              <div className="text-center text-muted-foreground">
                No users found for &quot;{searchQuery}&quot;
              </div>
            )
          ) : (
            <UserList users={suggestedUsers} />
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ExplorePage;
