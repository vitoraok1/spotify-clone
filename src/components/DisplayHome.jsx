import React from 'react'
import Navbar from './Navbar'
import { albumsData, songsData } from '../assets/assets'
import AlbumItem from './AlbumItem'
import SongItem from './SongItem'

const DisplayHome = () => {
  return (
    <>
        <Navbar />
        <div className='mb-4'>
            <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
            <div className='flex no-scrollbar overflow-auto'>
                { albumsData.map((item, index) => (<AlbumItem key={index} img={item.image} name={item.name} desc={item.desc} id={item.id}/>)) }
            </div>
        </div>

        <div className='mb-4'>
            <h1 className='my-5 font-bold text-2xl'>Today's biggest hits</h1>
            <div className='flex no-scrollbar overflow-auto'>
                { songsData.map((item, index) => (<SongItem key={index} img={item.image} name={item.name} desc={item.desc} id={item.id}/>)) }
            </div>
        </div>
    </>
  )
}

export default DisplayHome
