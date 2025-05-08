import mongoose from 'mongoose';
import { validateTaj } from '../utils/taj-validator';

const donationSchema = new mongoose.Schema({
  location: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location', 
    required: true 
  },
  donor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donor', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  eligible: { 
    type: Boolean, 
    required: true 
  },
  ineligibilityReason: { 
    type: String, 
    required: function(this: any) { 
      return this.eligible === false; 
    } 
  },
  doctorName: { 
    type: String, 
    required: true 
  },
  directedDonation: { 
    type: Boolean, 
    required: true 
  },
  patientName: { 
    type: String, 
    required: function(this: any) {
      return this.directedDonation === true;
    } 
  },
  patientTaj: { 
    type: String, 
    required: function(this: any) {
      return this.directedDonation === true;
    },
    validate: {
      validator: function(this: any, taj: string) {
        return !this.directedDonation || validateTaj(taj);
      },
      message: 'Invalid patient TAJ number'
    }
  }
}, {
  timestamps: true
});

export const Donation = mongoose.model('Donation', donationSchema);
