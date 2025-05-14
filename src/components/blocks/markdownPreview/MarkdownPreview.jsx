'use client';

import { useMemo } from 'react';

import { YfmStaticView } from '@gravity-ui/markdown-editor';
import { toHTML } from './transform.jsx';

export function MarkdownPreview({ value }) {
    const html = useMemo(() => toHTML(value), [value]);

    return <YfmStaticView html={html} noListReset />;
}