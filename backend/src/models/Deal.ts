import mongoose, { Document, Schema } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  value: number;
  probability: number;
  stage: 'Prospect' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  closeDate?: Date;
  leadId?: mongoose.Types.ObjectId;
  contactId?: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>({
  title: { type: String, required: true, trim: true },
  value: { type: Number, required: true, min: 0 },
  probability: { type: Number, default: 0, min: 0, max: 100 },
  stage: { type: String, enum: ['Prospect', 'Proposal', 'Negotiation', 'Won', 'Lost'], default: 'Prospect' },
  closeDate: { type: Date },
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
  contactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model<IDeal>('Deal', DealSchema);
