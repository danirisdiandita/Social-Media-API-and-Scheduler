"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Eye, EyeOff, Trash2, Loader2, Key, AlertTriangle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useKey } from "@/hooks/useKey";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ApiKeysPage() {
  const { keys, isLoading, generateKey, deleteKey } = useKey();
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});
  const [generatingKey, setGeneratingKey] = useState(false);
  const [deletingKey, setDeletingKey] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<{ id: number; name?: string } | null>(null);
  const [newKeyName, setNewKeyName] = useState("");

  const toggleKeyVisibility = (id: number) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (key: string) => {
    try {
      const parsedKey = JSON.parse(key);
      const decryptedKey = parsedKey.encryptedData || key;
      navigator.clipboard.writeText(decryptedKey);
      toast.success("API key copied to clipboard", {
        position: "top-center",
      });
    } catch {
      navigator.clipboard.writeText(key);
      toast.success("API key copied to clipboard", {
        position: "top-center",
      });
    }
  };

  const maskKey = (key: string) => {
    try {
      const parsedKey = JSON.parse(key);
      const decryptedKey = parsedKey.encryptedData || key;
      if (decryptedKey.length < 12) return "*".repeat(decryptedKey.length);
      const prefix = decryptedKey.substring(0, 15);
      const suffix = decryptedKey.substring(decryptedKey.length - 4);
      return `${prefix}${"*".repeat(20)}${suffix}`;
    } catch {
      if (key.length < 12) return "*".repeat(key.length);
      const prefix = key.substring(0, 15);
      const suffix = key.substring(key.length - 4);
      return `${prefix}${"*".repeat(20)}${suffix}`;
    }
  };

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key", {
        position: "top-center",
      });
      return;
    }
    setGeneratingKey(true);
    await generateKey(newKeyName);
    setGeneratingKey(false);
    setShowCreateModal(false);
    setNewKeyName("");
  };

  const handleDeleteKey = async () => {
    if (!keyToDelete) return;
    setDeletingKey(keyToDelete.id);
    await deleteKey(keyToDelete.id);
    setDeletingKey(null);
    setShowDeleteModal(false);
    setKeyToDelete(null);
  };

  const openDeleteModal = (id: number, name?: string) => {
    setKeyToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const isKeyExpired = (expiresAt: string | Date) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="min-h-screen bg-[#B9F8FE] p-4 md:p-8 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-[3px] border-black bg-[#A6FAFF] p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black uppercase mb-2 tracking-tight">
                API Keys
              </h1>
              <p className="text-base font-medium">
                Manage authentication tokens for AutoPosting API
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="gap-2 cursor-pointer font-black uppercase w-full md:w-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-5 h-5" />
              New Key
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="border-[3px] border-black bg-white p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
          </div>
        ) : keys.length === 0 ? (
          <div className="border-[3px] border-black bg-white p-12 shadow-[8px_8px_0px_rgba(0,0,0,1)] border-dashed">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <Key className="w-16 h-16 stroke-[2.5px]" />
              <div>
                <h3 className="text-2xl font-black uppercase mb-2">No API Keys Yet</h3>
                <p className="text-sm mb-6">Create your first API key to get started</p>
              </div>
              <Button
                variant="default"
                size="lg"
                onClick={() => setShowCreateModal(true)}
                className="cursor-pointer font-black uppercase"
              >
                <Plus className="w-5 h-5 mr-2" />
                Generate First Key
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {keys.map((apiKey: any) => {
              const expired = isKeyExpired(apiKey.expires_at);
              return (
                <div
                  key={apiKey.id}
                  className="border-[3px] border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="border-b-[3px] border-black bg-[#FFE66D] p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="border-2 border-black bg-white p-2">
                          <Key className="w-6 h-6 stroke-[2.5px]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase">
                            {apiKey.name || "Production Key"}
                          </h3>
                          <p className="text-xs font-bold">
                            Created: {new Date(apiKey.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant={expired ? "destructive" : "success"}>
                        {expired ? "Expired" : "Active"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 border-2 border-black bg-gray-50 p-3 font-mono text-sm break-all">
                        {visibleKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="cursor-pointer"
                        >
                          {visibleKeys[apiKey.id] ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="cursor-pointer"
                        >
                          <Copy className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => openDeleteModal(apiKey.id, apiKey.name)}
                          disabled={deletingKey === apiKey.id}
                        >
                          {deletingKey === apiKey.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      Expires: {new Date(apiKey.expires_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 border-[3px] border-black bg-[#B4F8C8] shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          <div className="border-b-[3px] border-black bg-white p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 stroke-[2.5px]" />
              <h3 className="text-xl font-black uppercase">Security Tips</h3>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-xl font-black">→</span>
                <span className="text-sm font-medium">Never share API keys publicly or commit to version control</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-black">→</span>
                <span className="text-sm font-medium">Store keys in environment variables only</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-black">→</span>
                <span className="text-sm font-medium">Rotate keys regularly for maximum security</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-black">→</span>
                <span className="text-sm font-medium">Delete unused keys immediately</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-black">→</span>
                <span className="text-sm font-medium">Keys auto-expire after 30 days</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Key</DialogTitle>
            <DialogDescription>
              Enter a descriptive name to identify this API key later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production Server"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !generatingKey) {
                    handleGenerateKey();
                  }
                }}
                className="border-2 border-black h-12 text-base font-medium"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setNewKeyName("");
              }}
              disabled={generatingKey}
              className="font-bold uppercase"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleGenerateKey}
              disabled={generatingKey}
              className="cursor-pointer font-bold uppercase"
            >
              {generatingKey ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Applications using this key will stop working immediately.
            </DialogDescription>
          </DialogHeader>
          {keyToDelete?.name && (
            <div className="py-4 border-2 border-black bg-[#FFE66D] p-4">
              <p className="text-sm font-bold">
                Key: <span className="font-black uppercase">{keyToDelete.name}</span>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setKeyToDelete(null);
              }}
              disabled={deletingKey !== null}
              className="font-bold uppercase"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteKey}
              disabled={deletingKey !== null}
              className="cursor-pointer font-bold uppercase"
            >
              {deletingKey !== null ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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