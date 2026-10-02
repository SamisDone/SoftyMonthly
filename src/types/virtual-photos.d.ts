// Provided by vite-plugins/photos.ts: every image in public/photos with its real size.
// (Mirrors PhotoFile there; kept separate so the app build needs no Node types.)
declare module 'virtual:photos' {
  const photos: {
    file: string
    src: string
    width: number
    height: number
    thumb?: string
    thumbWidth?: number
  }[]
  export default photos
}
