import { create } from 'zustand';
import { registerSessionStore } from '@/shared/state/session-stores';
import type { SelectedMediaFile } from '@/shared/components/media/media-picker';

type PhotoState = {
  photo: SelectedMediaFile | null;
  setPhoto: (value: SelectedMediaFile | null) => void;
};

/** Session-only photo preview: no backend upload/persistence is implied. */
export const useProfilePhoto = create<PhotoState>()((set) => ({
  photo: null,
  setPhoto: (photo) => set({ photo }),
}));

registerSessionStore(useProfilePhoto);
