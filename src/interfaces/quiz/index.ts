import { QuestionInterface } from 'interfaces/question';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface QuizInterface {
  id?: string;
  subject: string;
  teacher_id?: string;
  created_at?: any;
  updated_at?: any;
  question?: QuestionInterface[];
  user?: UserInterface;
  _count?: {
    question?: number;
  };
}

export interface QuizGetQueryInterface extends GetQueryInterface {
  id?: string;
  subject?: string;
  teacher_id?: string;
}
