import express from 'express';
import TodoModel from '../models/todo/model';

const router = express.Router();

router.post('', (req: any, res: any) => {
  setTimeout(() => {
    TodoModel.create(req.body).then(todo => res.json(todo));
  }, req.query.delay || 0);
});

router.get('', (req: any, res: any) => {
  setTimeout(() => {
    TodoModel.findAll().then(todos => res.json(todos));
  }, req.query.delay || 0);
});

router.delete('/:id', (req: any, res: any) => {
  const { id } = req.params;
  setTimeout(() => {
    TodoModel.destroy({ where: { id } }).then(() => res.status(204).send());
  }, req.query.delay || 0);
});

export default router;
