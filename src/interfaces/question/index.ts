import { OptionInterface } from 'interfaces/option';
import { QuizInterface } from 'interfaces/quiz';
import { GetQueryInterface } from 'interfaces';

export interface QuestionInterface {
  id?: string;
  text: string;
  quiz_id?: string;
  created_at?: any;
  updated_at?: any;
  option?: OptionInterface[];
  quiz?: QuizInterface;
  _count?: {
    option?: number;
  };
}

export interface QuestionGetQueryInterface extends GetQueryInterface {
  id?: string;
  text?: string;
  quiz_id?: string;
}
