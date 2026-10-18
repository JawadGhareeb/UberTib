import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import type { MediaSource } from '@/shared/components/media/media-source-dialog';

export type SelectedMediaFile = {
  uri: string;
  fileName: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  source: MediaSource;
};

export type MediaPickerOptions = {
  allowMultiple?: boolean;
  squareCrop?: boolean;
  quality?: number;
};

/**
 * Returns null on cancel, assets on success, and throws actionable errors for
 * permission/launcher failure. No network requests or automatic upload.
 */
export async function pickMediaFromDevice(
  source: MediaSource,
  { allowMultiple = false, squareCrop = false, quality = 0.85 }: MediaPickerOptions = {},
): Promise<SelectedMediaFile[] | null> {
  if (source === 'files') {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      multiple: allowMultiple,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return null;
    return result.assets.map((asset) => ({
      uri: asset.uri,
      fileName: asset.name,
      mimeType: asset.mimeType,
      size: asset.size,
      source,
    }));
  }

  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      throw new Error('يحتاج التطبيق إذن الكاميرا لالتقاط صورة. فعّل الإذن من إعدادات الجهاز.');
    }
  }

  const config: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    quality,
    allowsEditing: squareCrop,
    ...(squareCrop ? { aspect: [1, 1] as [number, number] } : {}),
    allowsMultipleSelection: source === 'gallery' && allowMultiple && !squareCrop,
  };
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(config)
      : await ImagePicker.launchImageLibraryAsync(config);
  if (result.canceled) return null;

  return result.assets.map((asset) => ({
    uri: asset.uri,
    fileName: asset.fileName ?? (source === 'camera' ? 'camera.jpg' : 'image.jpg'),
    mimeType: asset.mimeType ?? 'image/jpeg',
    size: asset.fileSize,
    width: asset.width,
    height: asset.height,
    source,
  }));
}
