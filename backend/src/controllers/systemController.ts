import { Request, Response } from "express";

import { WorkstationModel } from "../clients/HardwareClient";

export const getSystems = async (req: Request, res: Response) => {
  try {
    const systems = await WorkstationModel.find();

    res.status(200).json({
      success: true,
      count: systems.length,
      data: systems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error to get data about the computers in the data base",
      error,
    });
  }
};
