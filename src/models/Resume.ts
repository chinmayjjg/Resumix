import { Schema, model, models } from 'mongoose';

const ResumeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parsedData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Resume || model('Resume', ResumeSchema);
