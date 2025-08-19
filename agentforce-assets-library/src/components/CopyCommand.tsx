'use client';

import React, { useState } from 'react';
import { IconCopy, IconCopied } from '@/utils/iconUtils';

interface CopyCommandProps {
  command: string;
}

export default function CopyCommand({ command }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-xl space-y-2">
        <div className="text-sm font-semibold text-white/90">Deploy Command:</div>
        <div className="flex items-start gap-2 bg-black/30 p-2 rounded-lg">
          <pre className="flex-1 text-sm font-mono text-white/80 overflow-x-auto whitespace-pre break-words max-h-40 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent p-2">
            {command}
          </pre>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-2 hover:bg-white/10 rounded-md transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <IconCopied /> : <IconCopy />}
          </button>
        </div>
      </div>
    </div>
  );
}
