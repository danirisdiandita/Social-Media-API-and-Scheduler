"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ChevronLeft, ChevronRight, FileText, Video, Lock, Globe } from "lucide-react";
import { usePostHistory } from "@/hooks/usePostHistory";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export type PostHistory = {
  id: number;
  user_id: number;
  connection_id: number;
  publish_id: string;
  title?: string;
  caption?: string;
  media_type?: string;
  privacy?: string;
  created_at: string;
  updated_at: string;
  connection: {
    id: number;
    connection_slug: string;
    social_media: string;
    display_name?: string;
    avatar_url?: string;
  };
};

const socialMedia2Logo = {
  tiktok: (
    <div className="flex items-center gap-2">
      <Image src="/TikTok_Icon_Black_Circle.png" alt="tiktok" width={20} height={20} />
      <span className="font-bold">TikTok</span>
    </div>
  ),
};

export default function PostHistoryPage() {
  const { data, error, isLoading, nextPage, prevPage, isDisabledNext, isDisabledPrev, handleDeletePostById } = usePostHistory();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: number; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (id: number, title: string) => {
    setPostToDelete({ id, title });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    await handleDeletePostById(postToDelete.id.toString());
    setIsDeleting(false);
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#B9F8FE] p-4 md:p-8 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-[3px] border-black bg-[#A6FAFF] p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <div>
            <h1 className="text-4xl font-black uppercase mb-2 tracking-tight">
              Post History
            </h1>
            <p className="text-base font-medium">
              View and manage your posted content
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="border-[3px] border-black bg-white p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="border-[3px] border-black bg-white p-12 shadow-[8px_8px_0px_rgba(0,0,0,1)] border-dashed">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <FileText className="w-16 h-16 stroke-[2.5px]" />
              <div>
                <h3 className="text-2xl font-black uppercase mb-2">No Posts Yet</h3>
                <p className="text-sm mb-6">Your post history will appear here once you start posting</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {data.data.map((post: PostHistory) => (
                <div
                  key={post.id}
                  className="border-[3px] border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="border-b-[3px] border-black bg-[#FFE66D] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-black uppercase mb-2 line-clamp-2">
                          {post.title || "Untitled Post"}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          {post.connection.avatar_url && (
                            <div className="border-2 border-black bg-white">
                              <img
                                src={post.connection.avatar_url}
                                alt={post.connection.display_name || "Avatar"}
                                className="w-8 h-8 object-cover"
                              />
                            </div>
                          )}
                          <span className="text-xs font-bold">
                            {post.connection.display_name || post.connection.connection_slug}
                          </span>
                          <span className="text-xs">
                            {socialMedia2Logo[post.connection.social_media as keyof typeof socialMedia2Logo] || post.connection.social_media}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        className="cursor-pointer"
                        onClick={() => openDeleteModal(post.id, post.title || "this post")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {post.caption && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wide">Caption</div>
                        <div className="border-2 border-black bg-gray-50 p-3 text-sm line-clamp-3">
                          {post.caption}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {post.media_type && (
                        <Badge variant="outline" className="gap-1">
                          <Video className="w-3 h-3" />
                          {post.media_type}
                        </Badge>
                      )}
                      {post.privacy && (
                        <Badge variant="outline" className="gap-1">
                          {post.privacy === "public" ? (
                            <Globe className="w-3 h-3" />
                          ) : (
                            <Lock className="w-3 h-3" />
                          )}
                          {post.privacy}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2 border-t-2 border-black">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold uppercase tracking-wide">Posted:</span>
                          <div className="text-sm font-medium mt-1">
                            {format(new Date(post.created_at), "MMM d, yyyy HH:mm")}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold uppercase tracking-wide">ID:</span>
                          <div className="text-xs font-mono mt-1 truncate max-w-[100px]">
                            {post.publish_id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-[3px] border-black bg-white p-4 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm font-bold">
                  Page <span className="font-black text-lg">{data.page}</span> of{" "}
                  <span className="font-black text-lg">{data.totalPages || 1}</span>
                  {" "}• Total: <span className="font-black text-lg">{data.totalCount || 0}</span> posts
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevPage}
                    disabled={isDisabledPrev}
                    className="cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextPage}
                    disabled={isDisabledNext}
                    className="cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post History?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {postToDelete?.title && (
            <div className="py-4 border-2 border-black bg-[#FF6B6B] p-4">
              <p className="text-sm font-bold text-white">
                Post: <span className="font-black uppercase">{postToDelete.title}</span>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer font-bold uppercase"
              onClick={() => {
                setShowDeleteModal(false);
                setPostToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer font-bold uppercase"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}