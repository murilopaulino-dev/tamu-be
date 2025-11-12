import { Request, Response } from "express";
import { DateTime } from "luxon";
import { BaseModel, BaseModelStatic } from "../models/BaseModel";

export const deleteModel = <M extends BaseModel>(model: BaseModelStatic<M>, paramId: string) => {
  return async (req: Request, res: Response) => {
    const itemId = req.params[paramId];

    if (!itemId) {
      return res.status(400).json({ success: false, error: `${paramId} é obrigatório` });
    }

    try {
      const item = await model.findByPk(itemId);
      if (!item) {
        return res.status(403).json({ success: false, error: "Item não encontrado" });
      }
      await item.update({ isActive: false, deletedAt: DateTime.now(), deletedBy: req.internalUser?.id });
      res.status(200).json({ success: true });
    } catch (error) {
      console.log('error', error)
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  };
};
