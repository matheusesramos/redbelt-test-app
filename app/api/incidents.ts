import axios from 'axios';
import { Incident } from '../types/incident';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchIncidents = async (token: string): Promise<Incident[]> => {
  try {
    const response = await axios.get(`${API_URL}/incidents`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.incidents;
  } catch (error) {
    console.error("Error fetching incidents:", error);
    throw error;
  }
};

export const newIncident = async (token: string, name: string, evidence: string, criticality: string, host: string) => {
  try {
    const response = await axios.post(`${API_URL}/incidents`,
      { name, evidence, criticality, host },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    // console.log(response);
    // return response.data;
  } catch (error) {
    console.error("Error creating new incident:", error);
    throw error;
  }
};

export const editIncident = async (token: string, name: string, evidence: string, criticality: string, host: string, id: number) => {
  try {
    const response = await axios.put(`${API_URL}/incidents/${id}`,
      { name, evidence, criticality, host },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    // return response.data;
  } catch (error) {
    console.error("Error creating new incident:", error);
    throw error;
  }
};

export const deleteIncident = async (token: string, id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/incidents/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    // return response.data;
  } catch (error) {
    console.error("Error creating new incident:", error);
    throw error;
  }
};