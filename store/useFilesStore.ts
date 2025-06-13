import { create } from "zustand";

type CloudinaryImage = {
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: string[];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
};

type FilesState = {
  files: CloudinaryImage[];
  index: number;
  setFiles: ({
    files,
    index,
  }: {
    files: CloudinaryImage[];
    index: number;
  }) => void;
  setIndex: (index: number) => void;
};

export const useFilesStore = create<FilesState>((set) => ({
  files: [],
  index: 0,
  setFiles: (state) => set({ files: state.files, index: state.index }),
  setIndex: (state) => set({ index: state }),
}));
