import { createContext, use, useEffect, useRef, useState } from "react";
// import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const seekVolumeBg = useRef();
    const seekVolumeBar = useRef();

    let previousVolume = 0.5;

    // const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            seconds: '00',
            minutes: 0,
        },
        totalTime: {
            seconds: '00',
            minutes: 0,
        }
    });

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    }

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }

    const playWithId = async (id) => {
        // await setTrack(songsData[id]);
        await audioRef.current.play();
        setPlayStatus(true);
    }

    const previous = async () => {
        if (track.id > 0) {
            // await setTrack(songsData[track.id - 1])
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    const next = async () => {
        if (track.id < songsData.length - 1) {
            // await setTrack(songsData[track.id + 1])
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    const seekSong = (e) => {
        const seekWidth = seekBg.current.clientWidth;
        const seekPosition = e.nativeEvent.offsetX;
        const seekPercentage = seekPosition / seekWidth;
        const seekTime = seekPercentage * audioRef.current.duration;
        audioRef.current.currentTime = seekTime;
    }

    const muteVolume = () => {
        const currentVolume = audioRef.current.volume;

        if (currentVolume === 0) {

            audioRef.current.volume = previousVolume || 0.5;
            seekVolumeBar.current.style.width = `${(previousVolume || 0.5) * 100}%`;
        } else {

            previousVolume = currentVolume;
            audioRef.current.volume = 0;
            seekVolumeBar.current.style.width = '0%';
        }
    };

    const seekVolume = (e) => {
        const seekWidth = seekVolumeBg.current.clientWidth;
        const seekPosition = e.nativeEvent.offsetX;
        const seekPercentage = seekPosition / seekWidth;

        audioRef.current.volume = seekPercentage;
        seekVolumeBar.current.style.width = `${seekPercentage * 100}%`;

        if (seekPercentage > 0) {
            previousVolume = seekPercentage;
        }
    };

    useEffect(() => {
        audioRef.current.ontimeupdate = () => {
            const currentSeconds = Math.floor(audioRef.current.currentTime % 60);
            const currentMinutes = Math.floor(audioRef.current.currentTime / 60);
            const totalSeconds = Math.floor(audioRef.current.duration % 60) || 0; // Evita NaN
            const totalMinutes = Math.floor(audioRef.current.duration / 60) || 0; // Evita NaN

            seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100) || 0) + '%';

            setTime({
                currentTime: {
                    seconds: String(currentSeconds).padStart(2, '0'),
                    minutes: currentMinutes,
                },
                totalTime: {
                    seconds: String(totalSeconds).padStart(2, '0'),
                    minutes: totalMinutes,
                }
            });
        };
    }, [audioRef]);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        // track,
        // setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong,
        seekVolume,
        seekVolumeBar,
        seekVolumeBg,
        muteVolume,
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;