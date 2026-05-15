import { useRef, useState } from "react";
import { Music2 } from "lucide-react";
import { BGM_SRC } from "../content/wedding";

export function MusicToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  return (
    <>
      <audio ref={audioRef} loop preload="none" src={BGM_SRC} />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "暂停音乐" : "播放音乐"}
        className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-champagne-200 bg-ivory-50/90 text-champagne-700 shadow-soft backdrop-blur md:h-14 md:w-14"
      >
        <Music2
          className={
            playing ? "h-5 w-5 animate-spin [animation-duration:6s]" : "h-5 w-5"
          }
        />
      </button>
    </>
  );
}
