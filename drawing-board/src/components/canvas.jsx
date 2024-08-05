import React, { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5001');

    socketRef.current.on('draw', ({ x0, y0, x1, y1 }) => {
      drawLine(x0, y0, x1, y1, false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    canvasRef.current.getContext('2d').moveToX = offsetX;
    canvasRef.current.getContext('2d').moveToY = offsetY;
  };

  const finishDrawing = () => {
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext('2d');
    drawLine(context.moveToX, context.moveToY, offsetX, offsetY, true);
    context.moveToX = offsetX;
    context.moveToY = offsetY;
  };

  const drawLine = (x0, y0, x1, y1, emit) => {
    const context = canvasRef.current.getContext('2d');
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) return;

    socketRef.current.emit('draw', { x0, y0, x1, y1 });
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      width={800}
      height={600}
      className="bg-gray-900"
    />
  );
};

export default Canvas;
