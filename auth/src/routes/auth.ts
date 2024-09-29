import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtAuth from '../middleware/jwtAuth';
import User from '../models/User';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { UserCreationAttributes } from '../types/interfaces/UserInterface';

dotenv.config();

const router = Router();

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { username, password, email } = req.body as UserCreationAttributes;
  if (!username || !password || !email) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const usernameExists = await User.findOne({ where: { username } });
  const emailExists = await User.findOne({ where: { email } });

  if (usernameExists)
    res.status(400).json({ error: 'Username already exists' });
  if (emailExists) res.status(400).json({ error: 'Email already exists' });
  try {
    const newUser = await User.create({ username, email, password });
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET as string,
    );
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (user && (await user.checkPassword(password))) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    res.status(200).json({ token, user });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

router.get(
  '/me',
  jwtAuth,
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findByPk(req.userId);
    if (user) {
      res.status(200).json({ username: user.username });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },
);

router.get(
  '/search/user',
  jwtAuth,
  async (req: Request, res: Response): Promise<void> => {
    const username = req.query.username as string;
    if (!username) {
      res.status(400).json({ error: 'Username query parameter is required' });
      return;
    }

    const users = await User.findAll({
      where: { username: { [Op.iLike]: `%${username}%` } },
    });

    const filteredUsers = users.filter((u) => u.id !== req.userId);

    if (filteredUsers.length) {
      const userData = filteredUsers.map((user) => ({
        user_id: user.id,
        username: user.username,
      }));
      res.status(200).json(userData);
    } else {
      res
        .status(404)
        .json({ error: 'No users found matching the search criteria' });
    }
  },
);

export default router;
