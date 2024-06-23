"use client";
import { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 70%;
  margin: 0 auto;
  background-color: #151515;
  border-radius: 8px;
  color: white;
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
  background-color: #ffe500;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-top: 10px;
`;

export default function CalculateForm({ isWeekend }) {
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

    // Round time up to nearest 5 minutes
    let roundedTime = Math.ceil(timeNum / 5) * 5;
    if (roundedTime < 15) {
      roundedTime = 15;
    }

    // Calculate fare
    let fare;
    if (isWeekend) {
      fare = 111 + (roundedTime / 60) * 700 + distanceNum * 19.75;
    } else {
      fare = 75 + (roundedTime / 60) * 400 + distanceNum * 19.75;
    }

    // Round fare up to the nearest 5 SEK
    const roundedFare = Math.ceil(fare / 5) * 5;

    setPrice(roundedFare);
    setError("");
  };

  return (
    <FormContainer>
      <Title>TaxiBilen Manual</Title>
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
