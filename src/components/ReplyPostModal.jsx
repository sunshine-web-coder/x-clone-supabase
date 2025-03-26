'use client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ComposeTweet } from './compose-tweet';

export function ReplyModal({ showReply, setShowReply, parentId, parentUsername }) {
  return (
    <Dialog open={showReply} onOpenChange={setShowReply}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 m-0 rounded-none border-none">
        <DialogTitle className="hidden">Reply to Post</DialogTitle>
        <div className="relative flex items-center justify-center w-full h-full p-5 pt-10">
          <div className="w-[500px] absolute top-0 p-5 rounded-2xl bg-black text-white border border-zinc-700">
            <ComposeTweet 
              parentId={parentId} 
              parentUsername={parentUsername} 
              isReply={true} 
              onSuccess={() => setShowReply(false)} 
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}