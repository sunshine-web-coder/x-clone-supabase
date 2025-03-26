import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabaseConfig';
import usePostStore from '@/store/usePostStore';
import { useToast } from '@/lib/toast-context';
import { useRouter } from 'next/navigation';

export default function PostDeleteConfirmModal({ showPostDeleteModal, setShowPostDeleteModal, postId, media_urls }) {
  const removePost = usePostStore(state => state.removePost);
  const { addToast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      // Delete images from storage first
      if (media_urls?.length > 0) {
        const filePaths = media_urls.map(url => {
          const pathStartIndex = url.indexOf('/media_uploads/') + '/media_uploads/'.length;
          return url.substring(pathStartIndex);
        });
  
        const { error: storageError } = await supabase.storage
          .from('media_uploads')
          .remove(filePaths);
        if (storageError) throw storageError;
      }
  
      // Delete post from database
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
  
      if (deleteError) throw deleteError;
  
      // Update client state
      removePost(postId);
      addToast('Your post was deleted', 'success');
      setShowPostDeleteModal(false);
      router.push('/home');
    } catch (error) {
      console.error('Error deleting post:', error);
      addToast('Failed to delete post. Please try again.', 'error');
    }
  };

  return (
    <Dialog open={showPostDeleteModal} onOpenChange={setShowPostDeleteModal} className="p-4">
      <DialogContent className="max-w-[280px] bg-[var(--background)] !rounded-[18px] border-none">
        <DialogHeader className="text-[var(--white)]">
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription className="!my-2 leading-4">
            This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.
          </DialogDescription>
          <DialogFooter>
            <div className="w-full flex flex-col gap-2">
              <Button
                variant="destructive"
                className="rounded-full border-none bg-[#F4212E] text-[var(--white)]"
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                className="border border-[#536471] hover:bg-zinc-900/80 hover:text-[var(--white)] h-8 rounded-full text-sm text-[var(--white)]"
                onClick={() => setShowPostDeleteModal(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}