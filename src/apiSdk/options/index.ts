import axios from 'axios';
import queryString from 'query-string';
import { OptionInterface, OptionGetQueryInterface } from 'interfaces/option';
import { GetQueryInterface } from '../../interfaces';

export const getOptions = async (query?: OptionGetQueryInterface) => {
  const response = await axios.get(`/api/options${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createOption = async (option: OptionInterface) => {
  const response = await axios.post('/api/options', option);
  return response.data;
};

export const updateOptionById = async (id: string, option: OptionInterface) => {
  const response = await axios.put(`/api/options/${id}`, option);
  return response.data;
};

export const getOptionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/options/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOptionById = async (id: string) => {
  const response = await axios.delete(`/api/options/${id}`);
  return response.data;
};
