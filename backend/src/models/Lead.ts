import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity {
  type: 'call' | 'email' | 'note' | 'meeting';
  description: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface ILead extends Document {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  source: 'Instagram' | 'Website' | 'Referral' | 'LinkedIn' | 'Other';
  status: 'New' | 'Contacted' | 'Qualified' | 'Won' | 'Lost';
  score: number;
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  activities: IActivity[];
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  type: { type: String, enum: ['call', 'email', 'note', 'meeting'], required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const LeadSchema = new Schema<ILead>({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  source: { type: String, enum: ['Instagram', 'Website', 'Referral', 'LinkedIn', 'Other'], required: true },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Won', 'Lost'], default: 'New' },
  score: { type: Number, default: 0, min: 0, max: 100 },
  notes: { type: String },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  activities: [ActivitySchema],
}, { timestamps: true });

export default mongoose.model<ILead>('Lead', LeadSchema);
