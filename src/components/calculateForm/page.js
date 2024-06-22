"use client";
import { useState } from "react";
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

export default function CalculateForm() {
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState(null);
  const [error, setError] = useState("");

  const calculateFare = () => {
    const distanceNum = parseFloat(distance);
    const timeNum = parseFloat(time);

    if (isNaN(distanceNum) || isNaN(timeNum)) {
      setError("Please enter valid numbers for distance and time.");
      setPrice(null);
      return;
    }

    let roundedTime = Math.ceil(timeNum / 5) * 5;
    if (roundedTime < 15) {
      roundedTime = 15;
    }

    const fare = 75 + (roundedTime / 60) * 400 + distanceNum * 19.75;
    const roundedFare = Math.ceil(fare / 5) * 5;

    setPrice(roundedFare);
    setError("");
  };

  return (
    <FormContainer>
      <Title>Taxi Fare Calculator</Title>
      <FormGroup>
        <label>Distance</label>
        <input
          type="text"
          placeholder="Distance (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <label>Time</label>
        <input
          type="text"
          placeholder="Time (min)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </FormGroup>
      <Button onClick={calculateFare}>Calculate Fare</Button>
      {price !== null && (
        <SuccessMessage>Total Fare: {price} SEK</SuccessMessage>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
}