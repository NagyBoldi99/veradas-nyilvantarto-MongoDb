import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Férfi', 'Nő'] },
  citizenship: { type: String, required: true },
  birthPlace: { type: String, required: true },
  birthDate: { type: Date, required: true },
  address: { type: String, required: true },
  tajNumber: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(taj: string) {
        if (!/^\d{9}$/.test(taj)) return false;
        
        let sum = 0;
        for (let i = 0; i < 8; i++) {
          const multiplier = (i % 2 === 0) ? 3 : 7;
          sum += parseInt(taj[i]) * multiplier;
        }
        return sum % 10 === parseInt(taj[8]);
      },
      message: 'Invalid TAJ number format'
    }
  }
}, {
  timestamps: true
});

export const Donor = mongoose.model('Donor', donorSchema);
