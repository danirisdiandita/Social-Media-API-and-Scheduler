"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  ExternalLink,
} from "lucide-react";
import { useConnection } from "@/hooks/useConnection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { AddConnectionModal } from "@/components/custom/dashboard/connections/add-connection-modal";

export type Connection = {
  id: number;
  createdAt: string;
  updatedAt: string;
  key: string;
  socialMediaId: string;
  platform: string;
  status: "active" | "pending" | "error";
  display_name?: string;
  social_media?: string;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
  connection_slug?: string;
  username?: string;
  is_default_draft?: boolean;
};

const socialMedia2Logo = {
  tiktok: (
    <div className="flex items-center gap-2">
      <Image
        src="/TikTok_Icon_Black_Circle.png"
        alt="tiktok"
        width={16}
        height={16}
      />
      <span className="font-bold text-xs">TikTok</span>
    </div>
  ),
};

export default function ConnectionsPage() {
  const {
    data,
    error,
    isLoading,
    handlePageChange,
    nextPage,
    prevPage,
    isDisabledNext,
    isDisabledPrev,
    handleDeleteConnectionById,
    mutate,
    search,
    setSearch,
  } = useConnection();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, setSearch]);

  const openDeleteModal = (id: number, name: string) => {
    setConnectionToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!connectionToDelete) return;
    setIsDeleting(true);
    await handleDeleteConnectionById(connectionToDelete.id.toString());
    setIsDeleting(false);
    setShowDeleteModal(false);
    setConnectionToDelete(null);
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied!", {
      position: "top-center",
    });
  };

  const handleUsernameClick = (username: string) => {
    const handle = username.startsWith("@") ? username : `@${username}`;
    copyToClipboard(handle);
    window.open(`https://tiktok.com/${handle}`, "_blank");
  };

  const handleToggleDraft = async (id: number, current: boolean) => {
    const res = await fetch(`/api/connection/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_default_draft: !current }),
    });
    if (res.ok) {
      mutate();
    }
  };

  const totalPages = data?.totalPages || 1;
  const currentPage = data?.page || 1;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#B9F8FE] p-4 md:p-8 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-[3px] border-black bg-[#FFE66D] p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black uppercase mb-2 tracking-tight">
                Connections
              </h1>
              <p className="text-base font-medium">
                Manage your social media connections
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by username..."
                  className="border-2 border-black rounded-none h-10 w-48 text-sm"
                />
                {search && (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="cursor-pointer text-xs"
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                    }}
                  >
                    x
                  </Button>
                )}
              </div>
              <AddConnectionModal />
            </div>
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
              <Users className="w-16 h-16 stroke-[2.5px]" />
              <div>
                <h3 className="text-2xl font-black uppercase mb-2">
                  No Connections Yet
                </h3>
                <p className="text-sm mb-6">
                  {search
                    ? "No results found"
                    : "Add your first social media connection to get started"}
                </p>
              </div>
              {!search && <AddConnectionModal />}
            </div>
          </div>
        ) : (
          <>
            <div className="border-[3px] border-black bg-white p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm font-bold">
                  <span className="font-black text-lg">
                    {data.totalCount || 0}
                  </span>{" "}
                  connections
                  {search && (
                    <span className="text-gray-500">
                      {" "}
                      — &quot;{search}&quot;
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={prevPage}
                    disabled={isDisabledPrev}
                    className="cursor-pointer border-2 border-black rounded-none h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`dots-${i}`}
                        className="px-1 text-sm font-bold"
                      >
                        ...
                      </span>
                    ) : (
                      <Button
                        key={p}
                        variant={p === currentPage ? "default" : "outline"}
                        size="icon-sm"
                        onClick={() => handlePageChange(p as number)}
                        className={`cursor-pointer border-2 border-black rounded-none h-8 w-8 text-xs font-bold ${p === currentPage ? "bg-black text-white hover:bg-gray-800" : ""}`}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={nextPage}
                    disabled={isDisabledNext}
                    className="cursor-pointer border-2 border-black rounded-none h-8 w-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {data.data.map((connection: Connection) => (
                <div
                  key={connection.id}
                  className="border-[3px] border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-1 flex items-center gap-3 p-3 border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-black bg-[#B4F8C8] sm:min-w-[220px]">
                      {connection.avatar_url ? (
                        <div className="border-2 border-black bg-white shrink-0">
                          <img
                            src={connection.avatar_url}
                            alt={connection.display_name || "Avatar"}
                            className="w-10 h-10 object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 border-2 border-black bg-white shrink-0 flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-sm font-black uppercase truncate">
                          {connection.display_name || "Unknown"}
                        </h3>
                        {connection.username && (
                          <button
                            className="text-xs font-medium text-gray-600 cursor-pointer hover:text-black transition-colors flex items-center gap-1 group"
                            onClick={() =>
                              handleUsernameClick(connection.username!)
                            }
                          >
                            <span className="truncate">
                              @{connection.username}
                            </span>
                            <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )}
                        <div className="mt-1">
                          {socialMedia2Logo[
                            connection.social_media as keyof typeof socialMedia2Logo
                          ] || connection.social_media}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center p-3 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide mb-1">
                          <span>ID</span>
                          <button
                            onClick={() =>
                              copyToClipboard(connection.connection_slug || "")
                            }
                            className="cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="font-mono text-xs truncate">
                          {connection.connection_slug}
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                          <span>
                            {format(
                              new Date(connection.created_at || ""),
                              "MMM d, yyyy",
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() =>
                            handleToggleDraft(
                              connection.id,
                              !!connection.is_default_draft,
                            )
                          }
                          className="cursor-pointer flex items-center gap-1.5"
                        >
                          <div
                            className={`w-8 h-4 border-2 border-black transition-colors flex items-center ${connection.is_default_draft ? "bg-[#B4F8C8]" : "bg-gray-200"}`}
                          >
                            <div
                              className={`w-2.5 h-2.5 border-2 border-black bg-white transition-transform ${connection.is_default_draft ? "translate-x-[14px]" : "translate-x-[1px]"}`}
                            />
                          </div>
                          <span className="text-[10px] font-bold uppercase whitespace-nowrap">
                            Draft
                          </span>
                        </button>
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          className="cursor-pointer shrink-0"
                          onClick={() =>
                            openDeleteModal(
                              connection.id,
                              connection.display_name || "this connection",
                            )
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Connection?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this connection? The access to
              this connection will be revoked immediately.
            </DialogDescription>
          </DialogHeader>
          {connectionToDelete?.name && (
            <div className="py-4 border-2 border-black bg-[#FF6B6B] p-4">
              <p className="text-sm font-bold text-white">
                Connection:{" "}
                <span className="font-black uppercase">
                  {connectionToDelete.name}
                </span>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer font-bold uppercase"
              onClick={() => {
                setShowDeleteModal(false);
                setConnectionToDelete(null);
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
