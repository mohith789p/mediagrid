"use client";
import MainLayout from "@/components/layout/MainLayout";
import React from "react";
import Image from "next/image";

// Use working demo images from Sling Academy sample API
const demoImages = [
  "https://api.slingacademy.com/public/sample-photos/1.jpeg",
  "https://api.slingacademy.com/public/sample-photos/2.jpeg",
  "https://api.slingacademy.com/public/sample-photos/3.jpeg",
  "https://api.slingacademy.com/public/sample-photos/4.jpeg",
  "https://api.slingacademy.com/public/sample-photos/5.jpeg",
  "https://api.slingacademy.com/public/sample-photos/6.jpeg",
  "https://api.slingacademy.com/public/sample-photos/7.jpeg",
  "https://api.slingacademy.com/public/sample-photos/8.jpeg",
  "https://api.slingacademy.com/public/sample-photos/9.jpeg",
  "https://api.slingacademy.com/public/sample-photos/10.jpeg",
  "https://api.slingacademy.com/public/sample-photos/11.jpeg",
  "https://api.slingacademy.com/public/sample-photos/12.jpeg",
  "https://api.slingacademy.com/public/sample-photos/13.jpeg",
  "https://api.slingacademy.com/public/sample-photos/14.jpeg",
  "https://api.slingacademy.com/public/sample-photos/15.jpeg",
  "https://api.slingacademy.com/public/sample-photos/16.jpeg",
  "https://api.slingacademy.com/public/sample-photos/17.jpeg",
  "https://api.slingacademy.com/public/sample-photos/18.jpeg",
  "https://api.slingacademy.com/public/sample-photos/19.jpeg",
  "https://api.slingacademy.com/public/sample-photos/20.jpeg",
];

const demoAvatars = [
  "https://randomuser.me/api/portraits/women/1.jpg",
  "https://randomuser.me/api/portraits/men/2.jpg",
  "https://randomuser.me/api/portraits/men/3.jpg",
  "https://randomuser.me/api/portraits/women/4.jpg",
  "https://randomuser.me/api/portraits/women/5.jpg",
  "https://randomuser.me/api/portraits/men/6.jpg",
  "https://randomuser.me/api/portraits/women/7.jpg",
  "https://randomuser.me/api/portraits/men/8.jpg",
];

const demoPosts = [
  {
    id: "1",
    author: "Alice",
    avatar: demoAvatars[0],
    content: "Just joined MediaGrid! Excited to connect with everyone.",
    time: "2m ago",
    images: [demoImages[0], demoImages[1], demoImages[2]],
    hashtags: ["#explore", "#photoshoot", "#trending"],
    likes: 14,
    comments: 3,
  },
  {
    id: "2",
    author: "Bob",
    avatar: demoAvatars[1],
    content: "Check out my latest photo from the mountains 🏔️",
    time: "10m ago",
    images: [demoImages[3], demoImages[4], demoImages[5]],
    hashtags: ["#mountains", "#adventure"],
    likes: 22,
    comments: 5,
  },
  {
    id: "3",
    author: "Charlie",
    avatar: demoAvatars[2],
    content: "Had a great day exploring the city!",
    time: "20m ago",
    images: [demoImages[6], demoImages[7], demoImages[8]],
    hashtags: ["#citylife", "#explore"],
    likes: 18,
    comments: 2,
  },
  {
    id: "4",
    author: "Diana",
    avatar: demoAvatars[3],
    content: "Loving the new features on MediaGrid!",
    time: "30m ago",
    images: [demoImages[9], demoImages[10], demoImages[11]],
    hashtags: ["#mediagrid", "#new"],
    likes: 11,
    comments: 1,
  },
  {
    id: "5",
    author: "Eve",
    avatar: demoAvatars[4],
    content: "Who's up for a movie night?",
    time: "40m ago",
    images: [demoImages[12], demoImages[13], demoImages[14]],
    hashtags: ["#movienight", "#friends"],
    likes: 9,
    comments: 0,
  },
  {
    id: "6",
    author: "Frank",
    avatar: demoAvatars[5],
    content: "Nature walk this morning was refreshing 🌲",
    time: "1h ago",
    images: [demoImages[15], demoImages[16], demoImages[17]],
    hashtags: ["#nature", "#morningwalk"],
    likes: 17,
    comments: 4,
  },
  {
    id: "7",
    author: "Grace",
    avatar: demoAvatars[6],
    content: "Coffee and coding ☕💻",
    time: "2h ago",
    images: [demoImages[18], demoImages[19], demoImages[0]],
    hashtags: ["#coffee", "#coding"],
    likes: 21,
    comments: 6,
  },
  {
    id: "8",
    author: "Henry",
    avatar: demoAvatars[7],
    content: "Sunset at the beach was amazing! 🌅",
    time: "3h ago",
    images: [demoImages[1], demoImages[2], demoImages[3]],
    hashtags: ["#beach", "#sunset"],
    likes: 16,
    comments: 2,
  },
];

const demoStories = [
  {
    id: "me",
    name: "Create story",
    avatar: "",
    isCreate: true,
  },
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: String(i + 1),
    name: [
      "Mohith",
      "Alice",
      "Bob",
      "Charlie",
      "Diana",
      "Eve",
      "Frank",
      "Grace",
    ][i],
    avatar: `https://randomuser.me/api/portraits/${
      i % 2 === 0 ? "men" : "women"
    }/${i + 1}.jpg`,
    isCreate: false,
  })),
];

export default function HomePage() {
  return (
    <MainLayout>
      <div className="w-full h-full min-h-[calc(100vh-4rem)] px-0 md:px-0">
        {/* Create Post Input */}
        <div className="w-full max-w-3xl mx-auto mb-6">
          <div className="flex items-center gap-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-3 shadow">
            <Image
              src="https://randomuser.me/api/portraits/men/1.jpg"
              alt="User"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <input
              type="text"
              className="flex-1 rounded-full px-4 py-2 bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none"
              placeholder="What's on your mind, Mohith?"
            />
            <button className="ml-2 px-3 py-1 rounded bg-[var(--color-primary)] text-[var(--color-bg-secondary)] font-medium">
              Post
            </button>
          </div>
          <div className="flex gap-4 mt-2">
            <button className="flex items-center gap-1 text-[var(--color-primary)] text-sm font-medium">
              <svg width="18" height="18" fill="currentColor">
                <circle cx="9" cy="9" r="8" />
              </svg>
              Live video
            </button>
            <button className="flex items-center gap-1 text-[var(--color-primary)] text-sm font-medium">
              <svg width="18" height="18" fill="currentColor">
                <rect x="3" y="3" width="12" height="12" />
              </svg>
              Photo/video
            </button>
            <button className="flex items-center gap-1 text-[var(--color-primary)] text-sm font-medium">
              <svg width="18" height="18" fill="currentColor">
                <circle cx="9" cy="9" r="8" />
              </svg>
              Feeling/activity
            </button>
          </div>
        </div>

        {/* Stories */}
        <div className="w-full max-w-3xl mx-auto flex gap-4 mb-8 overflow-x-auto">
          {demoStories.map((story) =>
            story.isCreate ? (
              <div key={story.id} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center mb-1">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    +
                  </span>
                </div>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  Create story
                </span>
              </div>
            ) : (
              <div key={story.id} className="flex flex-col items-center">
                <Image
                  src={story.avatar}
                  alt={story.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover border-2 border-[var(--color-primary)] mb-1"
                />
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {story.name}
                </span>
              </div>
            )
          )}
        </div>

        {/* Posts */}
        <div className="w-full max-w-3xl mx-auto">
          {demoPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl shadow mb-8"
            >
              <div className="flex items-center gap-3 px-4 pt-4">
                <Image
                  src={post.avatar}
                  alt={post.author}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-[var(--color-text)]">
                    {post.author}{" "}
                    <span className="text-sm text-red-500">❤️</span>
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    {post.time} · Eastchester, NY, United States
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 text-[var(--color-text)]">
                {post.content}
              </div>
              <div className="px-4 pb-2">
                {post.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-blue-600 text-xs mr-2"
                  >{`${tag}`}</span>
                ))}
              </div>
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  <Image
                    src={post.images[0]}
                    alt=""
                    width={600}
                    height={192}
                    className="rounded-lg object-cover w-full h-48 col-span-2"
                  />
                  <Image
                    src={post.images[1]}
                    alt=""
                    width={300}
                    height={96}
                    className="rounded-lg object-cover w-full h-24"
                  />
                  <Image
                    src={post.images[2]}
                    alt=""
                    width={300}
                    height={96}
                    className="rounded-lg object-cover w-full h-24"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between px-4 pb-2 text-xs text-[var(--color-text-secondary)]">
                <span>👍 A Uday and {post.likes} others</span>
                <span>{post.comments} comments</span>
              </div>
              <div className="flex border-t border-[var(--color-border)]">
                <button className="flex-1 py-2 hover:bg-[var(--color-bg)] transition text-[var(--color-text)] font-medium">
                  Like
                </button>
                <button className="flex-1 py-2 hover:bg-[var(--color-bg)] transition text-[var(--color-text)] font-medium">
                  Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
