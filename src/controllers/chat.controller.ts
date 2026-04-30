import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';

export const getAllRooms = (req: Request, res: Response) => {
  try {
    const rooms = ChatService.getRooms();
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch rooms' });
  }
};

export const getRoom = (req: Request, res: Response) => {
  try {
    const room = ChatService.getRoom(req.params.roomId as string);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch room' });
  }
};

export const getRoomMessages = (req: Request, res: Response) => {
  try {
    const roomId = Array.isArray(req.params.roomId)
      ? req.params.roomId[0]
      : req.params.roomId;
    const messages = ChatService.getMessages(roomId);
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch messages' });
  }
};
