import express from "express";
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getPlanByDeedNumber,
  getPlanByPlanId,
} from "../controllers/planController.js";

const router = express.Router();

router.get("/plan/:planId", getPlanByPlanId);
router.post("/", createPlan);
router.get("/", getPlans);
router.get("/:id", getPlanById);
router.get("/deed/:deedNumber", getPlanByDeedNumber);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);

export default router;
