"use client";
import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type="text"] {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-top: 10px;
`;

const TaxiForm = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      console.log(response);
      let index = 0;
      while (index < response.data.length) {
        const { lat, lon, type } = response.data[index];
        if (type !== "unclassified") {
          return { lat: parseFloat(lat), lon: parseFloat(lon) };
        }
        index++;
      }

      throw new Error("Address not found");
    } catch (err) {
      throw new Error("Error fetching coordinates");
    }
  };

  const roundToNearestFiveMinutes = (durationInSeconds) => {
    const durationInMinutes = Math.ceil(durationInSeconds / 60);
    if (durationInMinutes < 15) {
      return 15 * 60; // 15 minutes in seconds
    }
    return Math.ceil(durationInMinutes / 5) * 5 * 60; // round up to nearest 5 minutes, then convert to seconds
  };

  const roundToNearestFiveSEK = (amount) => {
    return Math.ceil(amount / 5) * 5; // round up to nearest 5 SEK
  };

  const calculatePrice = async () => {
    try {
      setError(null);
      setPrice(null);

      const pickupCoords = await getCoordinates(pickup);
      const dropoffCoords = await getCoordinates(dropoff);

      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lon},${pickupCoords.lat};${dropoffCoords.lon},${dropoffCoords.lat}?overview=false`
      );

      const data = response.data;

      if (data.routes.length > 0) {
        const distance = data.routes[0].distance; // in meters
        let duration = data.routes[0].duration; // in seconds

        console.log(distance / 1000 + " km");
        console.log(duration / 60 + " min");

        duration = roundToNearestFiveMinutes(duration);

        // Pricing logic: base fare + distance-based fare + time-based fare
        const baseFare = 75; // base fare in SEK
        const distanceFare = (distance / 1000) * 19.75; // per km fare in SEK
        const timeFare = (duration / 3600) * 400; // per hour fare in SEK

        let totalFare = baseFare + distanceFare + timeFare;
        totalFare = roundToNearestFiveSEK(totalFare);

        setPrice(totalFare.toFixed(2));
      } else {
        setError("Unable to calculate the route.");
      }
    } catch (err) {
      setError("Error calculating price");
    }
  };

  return (
    <FormContainer>
      <Title>Taxi Fare Calculator</Title>
      <FormGroup>
        <label>Pickup Address:</label>
        <input
          type="text"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Enter pickup address"
        />
      </FormGroup>
      <FormGroup>
        <label>Dropoff Address:</label>
        <input
          type="text"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          placeholder="Enter dropoff address"
        />
      </FormGroup>
      <Button onClick={calculatePrice}>Calculate Fare</Button>
      {price && <SuccessMessage>Total Fare: {price} SEK</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default TaxiForm;
