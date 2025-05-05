// src/controllers/hashtag.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Hashtag } from '../entities/Hashtag';

export class HashtagController {
  private repo = AppDataSource.getRepository(Hashtag);

  async list(req: Request, res: Response) {
    const all = await this.repo.find({ order:{tag:'ASC'} });
    res.json(all);
  }

  async getById(req: Request, res: Response) {
    const tag = await this.repo.findOneBy({ id: parseInt(req.params.id) });
    if (!tag) return res.status(404).json({ message:'Hashtag not found' });
    res.json(tag);
  }

  async create(req: Request, res: Response) {
    const ht = this.repo.create(req.body);
    await this.repo.save(ht);
    res.status(201).json(ht);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    let ht = await this.repo.findOneBy({ id });
    if (!ht) return res.status(404).json({ message:'Hashtag not found' });
    this.repo.merge(ht, req.body);
    await this.repo.save(ht);
    res.json(ht);
  }

  async delete(req: Request, res: Response) {
    const result = await this.repo.delete(parseInt(req.params.id));
    if (result.affected===0) return res.status(404).json({ message:'Hashtag not found' });
    res.status(204).send();
  }
}
