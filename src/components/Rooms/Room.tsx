import Peer from 'peerjs'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>()

  const videoGridRef = useRef<HTMLDivElement>(null)
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const peerRef = useRef<Peer | null>(null)
  const myVideoStreamRef = useRef<MediaStream | null>(null)
  const userStreamsRef = useRef<Map<string, HTMLVideoElement>>(new Map())

  useEffect(() => {
    const socket = io('http://localhost:4000') // Kết nối đến server io

    const initPeer = async () => {
      peerRef.current = new Peer() // Khởi tạo PeerJS

      // Lấy quyền truy cập vào camera và microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      myVideoStreamRef.current = stream

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream
        myVideoRef.current.addEventListener('loadedmetadata', () => {
          myVideoRef.current?.play()
        })
      }

      // Lắng nghe khi có cuộc gọi từ người dùng khác
      peerRef.current.on('call', (call) => {
        call.answer(stream) // Trả lời cuộc gọi với luồng video của mình
        call.on('stream', (userVideoStream) => {
          addVideoStream(userVideoStream, call.peer) // Hiển thị luồng video của người gọi
        })
      })

      // Khi PeerJS sẵn sàng, kết nối đến phòng
      peerRef.current.on('open', (id) => {
        socket.emit('join-room', roomId, id) // Gửi id của PeerJS vào phòng
      })

      // Lắng nghe khi có người dùng mới tham gia phòng
      socket.on('user-connected', (userId: string) => {
        connectToNewUser(userId, myVideoStreamRef.current) // Kết nối đến người dùng mới
      })

      // Khi người dùng ngắt kết nối
      socket.on('user-disconnected', (userId: string) => {
        console.log(`User disconnected: ${userId}`)
        // Xử lý việc ngắt kết nối nếu cần (ví dụ: xóa video)
        removeUserVideo(userId)
      })
    }

    const connectToNewUser = (userId: string, stream: MediaStream | null) => {
      if (!peerRef.current || !stream) return

      const call = peerRef.current.call(userId, stream) // Gọi đến người dùng mới
      call.on('stream', (userVideoStream) => {
        addVideoStream(userVideoStream, userId) // Hiển thị video của người dùng mới
      })
    }

    const addVideoStream = (stream: MediaStream, userId: string) => {
      if (userStreamsRef.current.has(userId)) return // Nếu video đã có, không thêm nữa

      const video = document.createElement('video')
      video.srcObject = stream
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
      videoGridRef.current?.append(video) // Thêm video vào video-grid
      userStreamsRef.current.set(userId, video) // Lưu video vào danh sách quản lý
    }

    const removeUserVideo = (userId: string) => {
      const videoElement = userStreamsRef.current.get(userId)
      if (videoElement) {
        videoElement.srcObject = null
        videoElement.remove() // Xóa video khỏi DOM
        userStreamsRef.current.delete(userId) // Xóa video khỏi danh sách
      }
    }

    initPeer()

    return () => {
      peerRef.current?.disconnect() // Hủy kết nối khi component bị unmount
    }
  }, [roomId])

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold mb-4'>Room: {roomId}</h1>
      <div className='grid grid-cols-1 gap-4' ref={videoGridRef}>
        <video ref={myVideoRef} className='w-full h-auto' />
      </div>
    </div>
  )
}
