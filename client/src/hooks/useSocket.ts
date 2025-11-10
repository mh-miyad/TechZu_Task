import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (postSlug: string, onCommentEvent: () => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      socket.emit('joinPost', postSlug);
    });

    socket.on('commentCreated', () => {
      console.log('New comment created');
      onCommentEvent();
    });

    socket.on('commentUpdated', () => {
      console.log('Comment updated');
      onCommentEvent();
    });

    socket.on('commentDeleted', () => {
      console.log('Comment deleted');
      onCommentEvent();
    });

    socket.on('commentLiked', () => {
      console.log('Comment liked');
      onCommentEvent();
    });

    socket.on('commentDisliked', () => {
      console.log('Comment disliked');
      onCommentEvent();
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return () => {
      if (socket) {
        socket.emit('leavePost', postSlug);
        socket.disconnect();
      }
    };
  }, [postSlug, onCommentEvent]);

  return socketRef.current;
};
