import { useRef, useEffect } from "react";

export function ResponsiveVideoLoop({
  smallSrc,
  largeSrc,
  smallPosterSrc,
  largePosterSrc,
  smallClassName,
  largeClassName,
  showLargeVideo,
  play = true,
  onCanPlay,
  onLoadedMetadata,
}) {
  const smallVideo = useRef(null);
  const largeVideo = useRef(null);

  // Autoplay video of current size
  useEffect(() => {
    const video = showLargeVideo ? largeVideo : smallVideo;
    play &&
      video.current
        ?.play()
        .then(() => {
          // Autoplay started successfully
        })
        .catch((error) => {
          // catch iOS battery saving play exception
        });
  }, [play, largeVideo, showLargeVideo, smallVideo]);

  return (
    <>
      {showLargeVideo === false && (
        <video
          className={smallClassName}
          ref={smallVideo}
          src={smallSrc + "#t=0.1"} // show first frame on iOS battery saving
          onCanPlay={onCanPlay}
          onLoadedMetadata={onLoadedMetadata}
          autoPlay={false} // don't autostart to avoid play icon on iOS battery saving
          muted
          playsInline
          webkit-playsinline="true"
          poster={smallPosterSrc}
          loop
        />
      )}
      {showLargeVideo === true && (
        <video
          className={largeClassName}
          ref={largeVideo}
          src={largeSrc + "#t=0.1"} // show first frame on iOS battery saving
          onCanPlay={onCanPlay}
          onLoadedMetadata={onLoadedMetadata}
          autoPlay={false} // don't autostart to avoid play icon on iOS battery saving
          muted
          playsInline
          webkit-playsinline="true"
          poster={largePosterSrc}
          loop
        />
      )}
    </>
  );
}

export default ResponsiveVideoLoop;
