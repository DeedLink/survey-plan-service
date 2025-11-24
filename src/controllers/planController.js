import Plan from "../models/Plan.js";

const syncPlanCoordinatesToDeed = async (plan) => {
  if (!plan.coordinates || plan.coordinates.length === 0) return;
  
  const deedServiceUrl = process.env.DEED_API_URL || "http://localhost:5001/api/deeds";
  
  try {
    const location = plan.coordinates.map(coord => ({
      longitude: coord.longitude,
      latitude: coord.latitude
    }));

    const response = await fetch(`${deedServiceUrl}/deed/${plan.deedNumber}/update-location`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location })
    });

    if (response.ok) {
      console.log(`✅ Synced plan coordinates to deed ${plan.deedNumber}`);
    } else {
      console.warn(`⚠️ Failed to sync coordinates to deed ${plan.deedNumber}: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Error syncing coordinates to deed ${plan.deedNumber}:`, error.message);
  }
};

export const createPlan = async (req, res) => {
  console.log(req.body);
  try {
    const plan = new Plan(req.body);
    await plan.save();
    
    if (plan.status === "completed" && plan.coordinates && plan.coordinates.length > 0) {
      await syncPlanCoordinatesToDeed(plan);
    }
    
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPlans = async (_req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanByDeedNumber = async (req, res) => {
  try {
    const { deedNumber } = req.params;

    if (!deedNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Deed number is required" 
      });
    }

    const plans = await Plan.find({ deedNumber }).sort({ createdAt: -1 });
    
    if (!plans || plans.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: `No plan found for deed number: ${deedNumber}` 
      });
    }

    const latestCompletedPlan = plans.find(p => p.status === "completed") || plans[0];

    res.status(200).json({ 
      success: true, 
      data: latestCompletedPlan,
      allPlans: plans
    });

  } catch (error) {
    console.error("Error fetching plan by deed number:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later.", 
      error: error.message 
    });
  }
};

export const getPlanByPlanId = async (req, res) => {
  try {
    const { planId } = req.params;
    if (!planId) {
      return res.status(400).json({ success: false, message: "Plan ID is required" });
    }

    const plan = await Plan.findOne({ planId });
    if (!plan) {
      return res.status(404).json({ success: false, message: `No plan found for planId: ${planId}` });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error("Error fetching plan by planId:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    
    if (plan.status === "completed" && plan.coordinates && plan.coordinates.length > 0) {
      await syncPlanCoordinatesToDeed(plan);
    }
    
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
