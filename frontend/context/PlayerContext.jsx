import { createContext, useEffect, useRef, useState } from "react";
import config from "../../config";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const seekVolumeBg = useRef();
    const seekVolumeBar = useRef();

    let previousVolume = 0.5;

    const [track, setTrack] = useState();
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [album, setAlbum] = useState();
    const [albumTracks, setAlbumTracks] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { seconds: '00', minutes: 0 },
        totalTime: { seconds: '00', minutes: 0 },
    });

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Estado para armazenar o índice da faixa atual

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    };

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    };

    const playWithName = async (artist, track) => {
        try {
            const url = `${config.apiUrl}/api/search?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`;
            const response = await fetch(url);
            const musicData = await response.json();

            if (musicData.data.length > 0) {
                const previewUrl = musicData.data[0].preview;

                setTrack(musicData.data[0]);
                audioRef.current.src = previewUrl;
                await audioRef.current.play();
                setPlayStatus(true);
            } else {
                console.error("Nenhuma música encontrada");
            }
        } catch (error) {
            console.error("Erro ao buscar música:", error);
        }
    };

    // Função para ir para a faixa anterior
    const previous = async () => {
        if (previewUrls.length > 0) {
            const previousIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : previewUrls.length - 1;
            setCurrentTrackIndex(previousIndex);
            audioRef.current.src = previewUrls[previousIndex].preview;
            await audioRef.current.play();
            setPlayStatus(true);
            setTrack(previewUrls[previousIndex]);
        } else {
            console.error("O álbum ainda não foi carregado ou não há faixas disponíveis.");
        }
    };

    // Função para ir para a próxima faixa
    const next = async () => {
        if (previewUrls.length > 0) {
            const nextIndex = currentTrackIndex < previewUrls.length - 1 ? currentTrackIndex + 1 : 0;
            setCurrentTrackIndex(nextIndex);
            audioRef.current.src = previewUrls[nextIndex].preview;
            await audioRef.current.play();
            setPlayStatus(true);
            setTrack(previewUrls[nextIndex]);
        } else {
            console.error("O álbum ainda não foi carregado ou não há faixas disponíveis.");
        }
    };

    const seekSong = (e) => {
        const seekWidth = seekBg.current.clientWidth;
        const seekPosition = e.nativeEvent.offsetX;
        const seekPercentage = seekPosition / seekWidth;
        const seekTime = seekPercentage * audioRef.current.duration;
        audioRef.current.currentTime = seekTime;
    };

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
            const totalSeconds = Math.floor(audioRef.current.duration % 60) || 0;
            const totalMinutes = Math.floor(audioRef.current.duration / 60) || 0;

            seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100) || 0) + '%';

            setTime({
                currentTime: { seconds: String(currentSeconds).padStart(2, '0'), minutes: currentMinutes },
                totalTime: { seconds: String(totalSeconds).padStart(2, '0'), minutes: totalMinutes },
            });
        };
    }, [audioRef]);

    useEffect(() => {
        if (albumTracks.length > 0) {
            setPreviewUrls(albumTracks.map(track => track.preview));
        }
    }, [albumTracks]);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        previewUrls,
        setPreviewUrls,
        setSelectedTrack,
        selectedTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithName,
        previous,
        next,
        seekSong,
        seekVolume,
        seekVolumeBar,
        seekVolumeBg,
        muteVolume,
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;