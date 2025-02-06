import React from 'react'
import { useNavigate } from 'react-router-dom'

const AlbumItem = ({img, desc, id}) => {
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(`/album/${id}`)} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
            <img className='rounded' src={img} alt="" />
            <p className='text-slate-200 text-sm mt-2'>{desc}</p>
        </div>
      )
}

export default AlbumItem

