Summarist dynamic library durations patch

Copy the src directory into your project root and overwrite the corresponding files.

Updated:
 src/app/for-you/library/page.tsx
 src/app/for-you/components/Recommended.tsx
 src/app/for-you/components/Suggested.tsx
New:
 src/lib/audioDuration.ts

Durations now load asynchronously from actual audio metadata, not hardcoded strings.
Guest books reuse audio URLs from their feed when available. Saved Firestore library records fetch the book detail by ID to obtain the audio URL. Book tiles render immediately and update their time as metadata resolves.
