"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, Trash2, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useConnection } from "@/hooks/useConnection";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
};

const socialMedia2Logo = {
  tiktok: (
    <div className="flex items-center gap-2">
      <Image src="/TikTok_Icon_Black_Circle.png" alt="tiktok" width={24} height={24} />
      <span className="font-bold">TikTok</span>
    </div>
  ),
};

export default function ConnectionsPage() {
  const { data, error, isLoading, handlePageChange, nextPage, prevPage, isDisabledNext, isDisabledPrev, handleDeleteConnectionById } = useConnection();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
            <AddConnectionModal />
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
                <h3 className="text-2xl font-black uppercase mb-2">No Connections Yet</h3>
                <p className="text-sm mb-6">Add your first social media connection to get started</p>
              </div>
              <AddConnectionModal />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {data.data.map((connection: Connection) => (
                <div
                  key={connection.id}
                  className="border-[3px] border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="border-b-[3px] border-black bg-[#B4F8C8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {connection.avatar_url && (
                          <div className="border-2 border-black bg-white">
                            <img
                              src={connection.avatar_url}
                              alt={connection.display_name || "Avatar"}
                              className="w-12 h-12 object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-black uppercase">
                            {connection.display_name || "Unknown"}
                          </h3>
                          <div className="text-xs font-bold">
                            {socialMedia2Logo[connection.social_media as keyof typeof socialMedia2Logo] || connection.social_media}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        className="cursor-pointer"
                        onClick={() => openDeleteModal(connection.id, connection.display_name || "this connection")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide">Connection ID</span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer h-6 w-6"
                          onClick={() => copyToClipboard(connection.connection_slug || "")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="border-2 border-black bg-gray-50 p-2 font-mono text-xs break-all">
                        {connection.connection_slug}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-black">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide mb-1">Created</div>
                        <div className="text-sm font-medium">
                          {format(new Date(connection.created_at || ""), "MMM d, yyyy")}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide mb-1">Updated</div>
                        <div className="text-sm font-medium">
                          {format(new Date(connection.updated_at || ""), "MMM d, yyyy")}
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
                  {" "}• Total: <span className="font-black text-lg">{data.totalCount || 0}</span> connections
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
            <DialogTitle>Delete Connection?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this connection? The access to this connection will be revoked immediately.
            </DialogDescription>
          </DialogHeader>
          {connectionToDelete?.name && (
            <div className="py-4 border-2 border-black bg-[#FF6B6B] p-4">
              <p className="text-sm font-bold text-white">
                Connection: <span className="font-black uppercase">{connectionToDelete.name}</span>
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