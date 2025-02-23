import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['mobile', 'largeScreen']
    },
    width: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    }
}, { _id: false });

const bannerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    screen: screenSchema
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
