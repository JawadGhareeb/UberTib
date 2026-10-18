export type StructuralReadState =
  | 'loading-initial'
  | 'loading-refresh'
  | 'empty-no-data'
  | 'empty-filtered'
  | 'partial'
  | 'stale'
  | 'error-fetch'
  | 'error-permission'
  | 'success';
