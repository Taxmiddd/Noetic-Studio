"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image", "video"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        const html = editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
        onChange(html);
      });
    }
  }, [onChange]);

  useEffect(() => {
    if (quillRef.current) {
      const currentHtml = editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
      if (value !== currentHtml) {
        // Prevent infinite loop by only updating if the value actually changed externally
        const delta = quillRef.current.clipboard.convert({ html: value });
        quillRef.current.setContents(delta, "silent");
      }
    }
  }, [value]);

  return (
    <div className={className}>
      <div ref={editorRef} className="h-full bg-white text-black" />
    </div>
  );
}
