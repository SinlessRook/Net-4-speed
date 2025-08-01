/**
 * @file This file contains all the API calls to the backend.
 */

import axios from "axios";

const API_URL = "http://localhost:8000";

/**
 * Signs up a new user.
 * @param username The username of the user.
 * @param password The password of the user.
 * @returns The response from the server.
 */
export const signup = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/signup`, {
    username,
    password,
  });
  return response.data;
};

/**
 * Signs in a user.
 * @param username The username of the user.
 * @param password The password of the user.
 * @returns The response from the server.
 */
export const signin = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/signin`, {
    username,
    password,
  });
  return response.data;
};

/**
 * Gets the garage of the user.
 * @param token The authentication token of the user.
 * @returns The response from the server.
 */
export const getGarage = async (token) => {
  const response = await axios.get(`${API_URL}/garage/getall`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Unlocks a vehicle for the user.
 * @param token The authentication token of the user.
 * @param vehicleId The ID of the vehicle to unlock.
 * @returns The response from the server.
 */
export const unlockVehicle = async (token, vehicleId) => {
  const response = await axios.post(
    `${API_URL}/garage/unlock/${vehicleId}`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};
