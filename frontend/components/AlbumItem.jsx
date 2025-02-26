import React, { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

const AlbumItem = ({img, name, desc, id, album}) => {
    const navigate = useNavigate();
    const { saveAlbum } = useContext(PlayerContext);

    const handleClick = () => {
        console.log("Álbum:", album);
        // saveAlbum(album);
        navigate(`/album/${id}`, { state: { album } });
    };

    return (
        <div onClick={handleClick} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
            <img className='rounded' src={img} alt="" />
            <p className='font-bold mt-2 mb-1'>{name}</p>
            <p className='text-slate-200 text-sm'>{desc}</p>
        </div>
      );
};

export default AlbumItem;

