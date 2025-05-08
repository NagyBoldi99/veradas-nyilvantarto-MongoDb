import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  active: { type: Boolean, default: true },
});

export const Location = mongoose.model('Location', locationSchema);
