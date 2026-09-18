import { Request, Response } from "express";
import { idParam } from "../../lib/params";
import * as tripsService from "./trips.service";

export async function listTripsHandler(req: Request, res: Response) {
  const trips = await tripsService.listTrips(req.tenantId!, req.query as any);
  res.json(trips);
}

export async function getTripHandler(req: Request, res: Response) {
  const trip = await tripsService.getTrip(req.tenantId!, idParam(req));
  res.json(trip);
}

export async function createTripHandler(req: Request, res: Response) {
  const trip = await tripsService.createTrip(req.tenantId!, req.user!.userId, req.body);
  res.status(201).json(trip);
}

export async function updateTripHandler(req: Request, res: Response) {
  const trip = await tripsService.updateTrip(req.tenantId!, idParam(req), req.body);
  res.json(trip);
}

export async function deleteTripHandler(req: Request, res: Response) {
  await tripsService.deleteTrip(req.tenantId!, idParam(req));
  res.status(204).send();
}
