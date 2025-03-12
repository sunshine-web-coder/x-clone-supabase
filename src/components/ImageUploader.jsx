'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseConfig';
import { Label } from '@/components/ui/label';

export default function ImageUploader({
  bucketName,
  folderPath,
  onUploadComplete,
  defaultImage,
  showPreview = true,
  previewSize = 'h-24 w-24',
  buttonText = 'Upload Image',
  accept = 'image/*',
  className = '',
  profile
}) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(defaultImage);

  const uploadImage = async event => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl }
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      // Update preview
      setPreviewUrl(publicUrl);

      // Call the callback with the public URL
      if (onUploadComplete) {
        await onUploadComplete(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {showPreview && (
        <Avatar className={previewSize}>
          <AvatarImage src={previewUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.display_name}`} alt="Upload preview" />
          <AvatarFallback>{profile.display_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="image-upload">Upload Image</Label>
        <input id="image-upload" type="file" accept={accept} onChange={uploadImage} disabled={uploading} className="hidden" />
        <Button variant="outline" disabled={uploading} onClick={() => document.getElementById('image-upload').click()} className="w-full">
          {uploading ? 'Uploading...' : buttonText}
        </Button>
      </div>
    </div>
  );
}
