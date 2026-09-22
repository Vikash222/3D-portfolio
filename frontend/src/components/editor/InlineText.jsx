import React, { useRef, useEffect } from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';

export default function InlineText({
  value,
  onChange,
  className = '',
  placeholder = 'Click to edit...',
  as: Component = 'span',
}) {
  const { isEditMode, isPreviewMode } = useVisualEditor();
  const editable = isEditMode && !isPreviewMode;
  const elRef = useRef(null);

  // Sync content when value changes externally
  useEffect(() => {
    if (elRef.current && document.activeElement !== elRef.current) {
      elRef.current.innerText = value || '';
    }
  }, [value]);

  if (!editable) {
    return <Component className={className}>{value || placeholder}</Component>;
  }

  const handleBlur = (e) => {
    const newText = e.currentTarget.innerText.trim();
    if (newText !== value && onChange) {
      onChange(newText);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && Component !== 'p' && Component !== 'div') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <Component
      ref={elRef}
      contentEditable
      suppressContentEditableWarning
      onClick={(e) => {
        if (editable) e.stopPropagation();
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} outline-dashed outline-1 outline-cyan-400/80 hover:outline-2 hover:outline-cyan-400 focus:outline-solid focus:outline-2 focus:outline-cyan-400 focus:bg-cyan-500/10 transition-all rounded px-1 -mx-1 cursor-text select-text relative min-w-[20px] inline-block`}
      title="✏️ Click to edit text directly"
    >
      {value || placeholder}
    </Component>
  );
}
