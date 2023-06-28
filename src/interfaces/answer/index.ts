import { UserInterface } from 'interfaces/user';
import { OptionInterface } from 'interfaces/option';
import { GetQueryInterface } from 'interfaces';

export interface AnswerInterface {
  id?: string;
  student_id?: string;
  option_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  option?: OptionInterface;
  _count?: {};
}

export interface AnswerGetQueryInterface extends GetQueryInterface {
  id?: string;
  student_id?: string;
  option_id?: string;
}
