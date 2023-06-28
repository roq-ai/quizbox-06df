import axios from 'axios';
import queryString from 'query-string';
import { SchoolInterface, SchoolGetQueryInterface } from 'interfaces/school';
import { GetQueryInterface } from '../../interfaces';

export const getSchools = async (query?: SchoolGetQueryInterface) => {
  const response = await axios.get(`/api/schools${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSchool = async (school: SchoolInterface) => {
  const response = await axios.post('/api/schools', school);
  return response.data;
};

export const updateSchoolById = async (id: string, school: SchoolInterface) => {
  const response = await axios.put(`/api/schools/${id}`, school);
  return response.data;
};

export const getSchoolById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/schools/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSchoolById = async (id: string) => {
  const response = await axios.delete(`/api/schools/${id}`);
  return response.data;
};
