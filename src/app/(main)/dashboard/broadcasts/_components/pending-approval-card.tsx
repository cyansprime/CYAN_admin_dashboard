"use client";

import { useState } from "react";

import { CheckCircle, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Broadcast } from "@/hooks/use-broadcasts";
import { useApproveBroadcast, useRejectBroadcast } from "@/hooks/use-broadcasts";

export function PendingApprovalCard({ broadcast }: { broadcast: Broadcast }) {
  const [expanded, setExpanded] = useState(false);
  const approveMutation = useApproveBroadcast();
  const rejectMutation = useRejectBroadcast();

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  function handleApprove() {
    toast.promise(approveMutation.mutateAsync(broadcast.id), {
      loading: "Approving and pushing to LINE...",
      success: "Broadcast approved and sent!",
      error: "Failed to approve broadcast",
    });
  }

  function handleReject() {
    toast.promise(rejectMutation.mutateAsync(broadcast.id), {
      loading: "Rejecting broadcast...",
      success: "Broadcast rejected",
      error: "Failed to reject broadcast",
    });
  }

  const audioSrc = broadcast.audioPath ? `/api/v1/broadcasts/${broadcast.id}/audio` : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{broadcast.title}</CardTitle>
            <Badge variant="secondary">pending</Badge>
          </div>
          <span className="text-muted-foreground text-xs tabular-nums">{broadcast.scheduledAt}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Script preview */}
        {broadcast.script && (
          <div>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-muted-foreground text-xs hover:underline"
            >
              {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              {expanded ? "Collapse script" : "Show script"}
            </button>
            {expanded && (
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
                {broadcast.script}
              </pre>
            )}
          </div>
        )}

        {/* Audio player */}
        {audioSrc ? (
          // biome-ignore lint/a11y/useMediaCaption: broadcast audio has no captions
          <audio controls preload="none" className="w-full">
            <source src={audioSrc} type="audio/wav" />
          </audio>
        ) : null}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" disabled={isPending}>
                <CheckCircle className="mr-1 size-4" />
                Approve & Push
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve broadcast?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will push the broadcast to all LINE friends immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleApprove}>Approve & Push</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isPending}>
                <XCircle className="mr-1 size-4" />
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject broadcast?</AlertDialogTitle>
                <AlertDialogDescription>
                  This broadcast will not be sent. You can re-generate it later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReject}>Reject</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
