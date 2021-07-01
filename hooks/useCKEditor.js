import React, { useRef, useState, useEffect } from 'react';

export default function useCKEditor() {
  const editorRef = useRef();
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const { CKEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = { CKEditor: require('ckeditor4-react') };
    setIsEditorLoaded(true);
  }, []);

  return Object.freeze({
    isEditorLoaded,
    CKEditor,
  });
}
