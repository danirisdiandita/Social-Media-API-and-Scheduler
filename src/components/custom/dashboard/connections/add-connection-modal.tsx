"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Image from "next/image";

const socialPlatforms = [
  { value: "tiktok", label: "TikTok", icon: "/TikTok_Icon_Black_Circle.png" },
];

export function AddConnectionModal() {
  const [open, setOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const router = useRouter();

  const handleConnect = () => {
    if (selectedPlatform === "tiktok") {
      console.log("Connecting to:", selectedPlatform);
      setOpen(false);
      setSelectedPlatform("");
      router.push("/api/connection/tiktok/oauth");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedPlatform("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="gap-2 cursor-pointer font-black uppercase w-full md:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add Connection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Connection</DialogTitle>
          <DialogDescription>
            Connect your social media accounts to get started
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="platform">Social Platform</Label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {socialPlatforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    <div className="flex items-center gap-2">
                      <Image src={platform.icon} alt={platform.label} width={20} height={20} />
                      <span>{platform.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="cursor-pointer font-bold uppercase"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConnect}
            disabled={!selectedPlatform}
            className="cursor-pointer font-bold uppercase"
          >
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
