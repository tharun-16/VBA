// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getUser = async (accountNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${accountNumber}`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getMiniStatement = async (accountNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions/${accountNumber}`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
