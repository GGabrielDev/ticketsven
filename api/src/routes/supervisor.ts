import { Router, Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import HttpException from "../exceptions/HttpException";
import { authRole } from "../middleware/auth.middleware";
import { Municipality } from "../models/Municipality";
import { Organism } from "../models/Organism";
import { Parish } from "../models/Parish";
import { Reason } from "../models/Reason";
import { Ticket } from "../models/Ticket";

type RouteRequest = Request<
  Record<string, never>, // Params
  // Query details:
  // "start_date": A unix timestamp
  // "end_date": A unix timestamp
  Record<"start_date" | "end_date", string>,
  Record<string, never> // Body
>;

const router = Router();

router.use(authRole("supervisor"));

router.get("/dates", async (_, res: Response, next: NextFunction) => {
  try {
    const oldestTicket = await Ticket.findOne({
      where: {
        [Op.and]: {
          isOpen: false,
          [Op.or]: [
            { closing_state: { [Op.eq]: "Efectiva" } },
            { closing_state: { [Op.eq]: "No Efectiva" } },
            { closing_state: { [Op.eq]: "Rechazada" } },
          ],
        },
      },
      order: [["createdAt", "ASC"]],
    });
    const newestTicket = await Ticket.findOne({
      where: {
        [Op.and]: {
          isOpen: false,
          [Op.or]: [
            { closing_state: { [Op.eq]: "Efectiva" } },
            { closing_state: { [Op.eq]: "No Efectiva" } },
            { closing_state: { [Op.eq]: "Rechazada" } },
          ],
        },
      },
      order: [["createdAt", "DESC"]],
    });
    if (!oldestTicket || !newestTicket)
      throw new HttpException(400, "There's no tickets in the system");
    const oldestDate = new Date(
      `${
        oldestTicket.createdAt.getMonth() + 1
      }/1/${oldestTicket.createdAt.getFullYear()}`
    );
    const newestDate = new Date(
      `${
        newestTicket.createdAt.getMonth() + 1
      }/1/${newestTicket.createdAt.getFullYear()}`
    );

    let month = oldestDate.getMonth();
    let year = oldestDate.getFullYear();
    const dates = [];
    do {
      dates.push([new Date(`${month + 1}/1/${year}`).getTime()]);
      month++;
      if (month === 12) {
        month = 0;
        year++;
      }
      dates[dates.length - 1].push(
        new Date(`${month + 1}/1/${year}`).getTime()
      );
    } while (month <= newestDate.getMonth() || year < newestDate.getFullYear());

    return res.status(200).json({ dates });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/tickets",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { start_date, end_date } = req.query;
      if (!start_date || !end_date)
        throw new HttpException(
          400,
          "One or two of the date ranges are missing"
        );
      const results = await Ticket.findAll({
        attributes: ["id", "createdAt"],
        where: {
          createdAt: {
            [Op.and]: {
              [Op.gte]: parseInt(start_date as string),
              [Op.lt]: parseInt(end_date as string),
            },
          },
          isOpen: { [Op.eq]: false },
        },
        include: [
          { model: Municipality, as: "municipality" },
          { model: Organism, as: "organism" },
          { model: Parish, as: "parish" },
          { model: Reason, as: "reason" },
        ],
      });
      return res.status(200).json({ results });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
