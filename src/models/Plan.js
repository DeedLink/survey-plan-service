import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    planId: {
        type: String,
        required: true,
        unique: true,
    },
    deedId: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'completed'],
        default: 'active',
    },
    details: {
        type: String,
    },
    signedBy: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;