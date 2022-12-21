import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { Models } from "../db";
import { Municipality as MunicipalityEntity } from "../models/Municipality";
import HttpException from "../exceptions/HttpException";

const router = Router();
const { Municipality } = Models;

interface IMunicipalityParams {
  municipalityId: number;
}

interface IMunicipalityBody {
  name: string;
}

type RouteRequest = Request<IMunicipalityParams, {}, IMunicipalityBody>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await Municipality.findAll({
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
        include: [Municipality.associations.parishes],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:municipalityId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { municipalityId } = req.params;

      const result = await Municipality.findByPk(municipalityId, {
        include: [Municipality.associations.parishes],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      if (!name)
        throw new HttpException(400, "The name is missing as the body");

      const result = (await Municipality.create({
        name,
      })) as MunicipalityEntity;

      return res.status(201).send(
        await Municipality.findByPk(result.id, {
          include: [Municipality.associations.parishes],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:municipalityId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { municipalityId } = req.params;
      const { name } = req.body;

      if (!municipalityId) {
        throw new HttpException(
          400,
          "The Municipality ID is missing as the param"
        );
      }

      const result = (await Municipality.findByPk(
        municipalityId
      )) as MunicipalityEntity | null;

      if (!result) {
        throw new HttpException(
          404,
          "The requested Municipality doesn't exist"
        );
      }

      if (name && name !== result.name) result.update({ name });

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:municipalityId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { municipalityId } = req.params;

      if (!municipalityId) {
        throw new HttpException(
          400,
          "The Municipality ID is missing as the param"
        );
      }
      const result = await Municipality.findByPk(municipalityId);

      if (!result) {
        throw new HttpException(
          404,
          "The requested Municipality doesn't exist"
        );
      }

      await result.destroy();

      res.status(200).send("The choosed Municipality was disable successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
