import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface SocketCallbacks {
  onCommentCreated?: () => void;
  onCommentUpdated?: () => void;
  onCommentDeleted?: () => void;
  onCommentLiked?: () => void;
  onCommentDisliked?: () => void;
}

export const useSocket = (postSlug: string, callbacks: SocketCallbacks) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Skip WebSocket if URL is not configured (e.g., on Netlify/production)
    if (!SOCKET_URL || SOCKET_URL.trim() === '') {
      console.log('WebSocket disabled - VITE_SOCKET_URL not configured');
      return;
    }

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
      callbacks.onCommentCreated?.();
    });

    socket.on('commentUpdated', () => {
      console.log('Comment updated');
      callbacks.onCommentUpdated?.();
    });

    socket.on('commentDeleted', () => {
      console.log('Comment deleted');
      callbacks.onCommentDeleted?.();
    });

    socket.on('commentLiked', () => {
      console.log('Comment liked');
      callbacks.onCommentLiked?.();
    });

    socket.on('commentDisliked', () => {
      console.log('Comment disliked');
      callbacks.onCommentDisliked?.();
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
  }, [postSlug]);

  return socketRef.current;
};
