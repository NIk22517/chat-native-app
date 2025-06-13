import { useMemo } from "react";

type FileCategory =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "excel"
  | "word"
  | "ppt"
  | "text"
  | "unknown";

const fileTypes: Record<string, FileCategory> = {
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  svg: "image",
  mp4: "video",
  mov: "video",
  avi: "video",
  mp3: "audio",
  wav: "audio",
  pdf: "pdf",
  xls: "excel",
  xlsx: "excel",
  doc: "word",
  docx: "word",
  ppt: "ppt",
  pptx: "ppt",
  txt: "text",
  csv: "text",
};

const fromMimeType = (mimeType: string): FileCategory => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return "excel";
  if (mimeType.includes("word")) return "word";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "ppt";
  if (mimeType.startsWith("text/")) return "text";
  return "unknown";
};

interface UseFileTypeProps {
  fileType: string;
  mimeType?: string;
}

const useFileType = ({
  fileType,
  mimeType,
}: UseFileTypeProps): FileCategory => {
  return useMemo(() => {
    if (mimeType) return fromMimeType(mimeType);
    return fileTypes[fileType.toLowerCase()] || "unknown";
  }, [fileType, mimeType]);
};

export default useFileType;
