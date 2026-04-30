import { Router } from 'express';
import {
  getAllRooms,
  getRoom,
  getRoomMessages,
} from '../controllers/chat.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         users:
 *           type: array
 *           items:
 *             type: string
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         roomId:
 *           type: string
 *         username:
 *           type: string
 *         content:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all active chat rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of all active rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 */
router.get('/', getAllRooms);

/**
 * @swagger
 * /api/rooms/{roomId}:
 *   get:
 *     summary: Get a single room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Room not found
 */
router.get('/:roomId', getRoom);

/**
 * @swagger
 * /api/rooms/{roomId}/messages:
 *   get:
 *     summary: Get message history for a room (last 50)
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 */
router.get('/:roomId/messages', getRoomMessages);

export default router;
