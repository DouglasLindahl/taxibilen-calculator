"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  background-color: #303030;
  color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px #101010;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  position: relative;

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

const SuggestionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;

  li {
    padding: 8px;
    cursor: pointer;
    color: black;
    &:hover {
      background-color: #f0f0f0;
    }
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
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      setSuggestions(response.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  useEffect(() => {
    fetchSuggestions(pickup, setPickupSuggestions);
  }, [pickup]);

  useEffect(() => {
    fetchSuggestions(dropoff, setDropoffSuggestions);
  }, [dropoff]);

  const handleSuggestionClick = (suggestion, setInput, setSuggestions) => {
    setInput(suggestion.display_name);
    setSuggestions([]);
  };

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const { lat, lon, type } = response.data.find(
        (result) => result.type !== "unclassified"
      );
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
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
          onFocus={() => setShowPickupSuggestions(true)}
          onBlur={() => setShowPickupSuggestions(false)}
          placeholder="Enter pickup address"
        />
        {showPickupSuggestions && pickupSuggestions.length > 0 && (
          <SuggestionsList>
            {pickupSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onMouseDown={() =>
                  handleSuggestionClick(
                    suggestion,
                    setPickup,
                    setPickupSuggestions
                  )
                }
              >
                {suggestion.display_name}
              </li>
            ))}
          </SuggestionsList>
        )}
      </FormGroup>
      <FormGroup>
        <label>Dropoff Address:</label>
        <input
          type="text"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          onFocus={() => setShowDropoffSuggestions(true)}
          onBlur={() => setShowDropoffSuggestions(false)}
          placeholder="Enter dropoff address"
        />
        {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
          <SuggestionsList>
            {dropoffSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onMouseDown={() =>
                  handleSuggestionClick(
                    suggestion,
                    setDropoff,
                    setDropoffSuggestions
                  )
                }
              >
                {suggestion.display_name}
              </li>
            ))}
          </SuggestionsList>
        )}
      </FormGroup>
      <Button onClick={calculatePrice}>Calculate Fare</Button>
      {price && <SuccessMessage>Total Fare: {price} SEK</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default TaxiForm;
