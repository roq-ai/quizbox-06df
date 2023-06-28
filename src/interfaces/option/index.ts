import { AnswerInterface } from 'interfaces/answer';
import { QuestionInterface } from 'interfaces/question';
import { GetQueryInterface } from 'interfaces';

export interface OptionInterface {
  id?: string;
  text: string;
  question_id?: string;
  created_at?: any;
  updated_at?: any;
  answer?: AnswerInterface[];
  question?: QuestionInterface;
  _count?: {
    answer?: number;
  };
}

export interface OptionGetQueryInterface extends GetQueryInterface {
  id?: string;
  text?: string;
  question_id?: string;
}
