import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';

import type { SelectedMediaFile } from '@/shared/components/media/media-picker';

type PhotoContext = {
  photo: SelectedMediaFile | null;
  setPhoto: (value: SelectedMediaFile | null) => void;
};
const Context = createContext<PhotoContext | null>(null);

/** Session-level mock preview; backend photo persistence is deliberately not simulated. */
export function ProfilePhotoProvider({ children }: PropsWithChildren) {
  const [photo, setPhoto] = useState<SelectedMediaFile | null>(null);
  const value = useMemo(() => ({ photo, setPhoto }), [photo]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useProfilePhoto(): PhotoContext {
  const value = useContext(Context);
  if (!value) throw new Error('useProfilePhoto needs ProfilePhotoProvider');
  return value;
}
