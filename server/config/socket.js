import { Server } from 'socket.io'

let io = null

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  })
  return io
}

export const getIO = () => io
