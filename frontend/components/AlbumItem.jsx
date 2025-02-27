import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';

const AlbumItem = ({img, name, desc, id, album}) => {
    const navigate = useNavigate();
    const { searchAlbum } = useContext(SearchContext);

    const handleClick = async () => {
        const albumSongs = await searchAlbum(name, desc);
        navigate(`/album/${id}`, { state: { album, albumSongs } });
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

