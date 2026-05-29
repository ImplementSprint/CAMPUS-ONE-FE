import { strict as assert } from 'node:assert';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EmptyState, ErrorState, LoadingState } from './state.ts';

test('LoadingState renders accessible status text', () => {
  const html = renderToStaticMarkup(
    createElement(LoadingState, {
      title: 'Loading student dashboard',
      description: 'Fetching enrollment and billing records.',
    }),
  );

  assert.match(html, /role="status"/);
  assert.match(html, /Loading student dashboard/);
  assert.match(html, /Fetching enrollment and billing records\./);
});

test('EmptyState renders a clear empty-region message', () => {
  const html = renderToStaticMarkup(
    createElement(EmptyState, {
      title: 'No applications found',
      description: 'Adjust filters or wait for new submissions.',
    }),
  );

  assert.match(html, /aria-label="No applications found"/);
  assert.match(html, /Adjust filters or wait for new submissions\./);
});

test('ErrorState renders retry action when provided', () => {
  const html = renderToStaticMarkup(
    createElement(ErrorState, {
      title: 'Unable to load portal',
      description: 'Refresh the page or try again later.',
      action: createElement('button', { type: 'button' }, 'Retry'),
    }),
  );

  assert.match(html, /role="alert"/);
  assert.match(html, /Unable to load portal/);
  assert.match(html, /<button type="button">Retry<\/button>/);
});
