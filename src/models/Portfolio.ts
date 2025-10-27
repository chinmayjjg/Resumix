import mongoose, { Schema, Document, models } from 'mongoose';

export interface IExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
}

export interface Itheme {
  theme:string;
}

export interface IProject {
  name: string;
  description: string;
  link?: string;
}


export interface IPortfolio extends Document {
  id?:string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  headline?: string;
  summary?: string;
  skills: string[];
  theme:'light'| 'dark';
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    phone: String,
    headline: String,
    summary: String,
    skills: [String],
    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        startYear: String,
        endYear: String,
      },
    ],
    theme: { 
    type: String, 
    enum: ['light', 'dark'], 
    default: 'light'
   } ,
    projects: [
      {
        name: String,
        description: String,
        link: String,
      },
    ],
  },
  
  { timestamps: true }
);

const Portfolio =
  models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
export default Portfolio;