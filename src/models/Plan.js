import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    planId: {
        type: String,
        required: true,
        unique: true,
    },
    deedNumber: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    documentURI: {
        type: String,
        required: true,
    },
    coordinates: {
        type: [
            {
                longitude: { type: Number, required: true },
                latitude: { type: Number, required: true },
            },
        ],
        validate: {
            validator: function (v) {
                return v.length > 2;
            },
            message: props => `${props.value} must have at least 3 coordinates!`,
        },
    },
    areaSize: {
        type: Number,
        required: true,
    },
    areaType: {
        type: String,
        enum: ['Hectare', 'Acre', 'Square Meter', 'Square Kilometer', 'Square Mile', 'Square Foot', 'Square Yard'],
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