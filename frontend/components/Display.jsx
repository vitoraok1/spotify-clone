import React, {useEffect, useRef} from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import DisplayArtist from './DisplayArtist'

const Display = () => {

    const displayRef = useRef();
    const location = useLocation();
    const isAlbum = location.pathname.includes('album');
    const albumId = isAlbum ? location.pathname.slice(-1) : "";

  return (
    <div ref={displayRef} className='w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
        <Routes>
            <Route path='/' element={<DisplayHome />} />
            <Route path='/album/:id' element={<DisplayAlbum />} />
            <Route path='/artist/:id' element={<DisplayArtist />} />
        </Routes>
    </div>
  )
}

export default Display
