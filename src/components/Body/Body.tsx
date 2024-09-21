import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Body() {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState('')
  const createRoomMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.get('http://localhost:4000/create-room')
      return response.data
    },
    onSuccess: (data) => {
      navigate(`/room/${data.roomId}`)
    },
    onError: (error) => {
      console.error('Error creating room:', error)
    }
  })
  const handleJoin = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`) // Điều hướng đến phòng với roomId
    } else {
      alert('Vui lòng nhập Room ID!')
    }
  }
  const handleNewMeeting = () => {
    createRoomMutation.mutate()
  }

  return (
    <div className='bg-white'>
      <div className='container'>
        <div className='flex items-center pt-32 h-full'>
          <div className='flex justify-center items-center w-1/2'>
            <div className='text-left'>
              <div className='select-none'>
                <h1 className='text-5xl mb-4'>
                  Secure video conferencing <br /> for everyone
                </h1>
                <p className='text-xl text-gray-500 mb-6'>
                  Connect, collaborate, and celebrate from <br /> anywhere with Google Meet
                </p>
              </div>
              <div className='flex items-center mb-8'>
                <button
                  onClick={handleNewMeeting}
                  className='bg-blue-500 text-white px-5 py-3 rounded-md flex items-center mr-4'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6 mr-1'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z'
                    />
                  </svg>
                  New meeting
                </button>

                <input
                  type='text'
                  placeholder='Enter a code or nickname'
                  onChange={(e) => setRoomId(e.target.value)}
                  className='border border-gray-500 p-3 rounded-md mr-4'
                />
                <button onClick={handleJoin} className='text-gray-500'>
                  Join
                </button>
              </div>
              <hr className='border-black border-1 py-2' />
              <div className='text-xs'>
                <a href='#' className='text-blue-500'>
                  Learn more
                </a>
                <span className='text-gray-500'> about Google Meet</span>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center items-center w-1/2 select-none'>
            <div className='relative mb-4'>
              <img
                src='https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg'
                alt='Meeting image'
                className='w-72 h-72'
              />
              <div className='absolute -left-20 top-1/2 transform -translate-y-1/2'>
                <button className='p-2 rounded-full hover:bg-gray-200'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
              </div>
              <div className='absolute -right-20 top-1/2 transform -translate-y-1/2'>
                <button className='p-2 rounded-full hover:bg-gray-200'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='py-4'>
              <div className='text-2xl'>Get a link you can share</div>
              <div className='text-gray-800'>
                Click<span className='text-black font-bold'> New meeting</span> to get a link you can send to people
                <br />
                <span className='items-center'>you want to meet with</span>
              </div>
            </div>
            <div className='flex'>
              <span className='inline-block w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
              <span className='inline-block w-2 h-2 bg-gray-300 rounded-full mr-2'></span>
              <span className='inline-block w-2 h-2 bg-gray-300 rounded-full'></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
