"use client";
import { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import styles from "./page.module.css";
import TaxiForm from "@/components/taxiForm/page";
import CalculateForm from "@/components/calculateForm/page";

const ToggleButton = styled.button`
  width: 50%;
  padding: 10px;
  background-color: ${({ active }) => (active ? "#FFE500" : "#151515")};
  color: ${({ active }) => (active ? "black" : "white")};
  border: 2px solid #ffe500;
  border-radius: ${({ isLeft }) =>
    isLeft ? "100px 0px 0px 100px" : "0px 100px 100px 0px"};
  cursor: pointer;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  width: 70%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const WeekendButton = styled.button`
  padding: 10px;
  background-color: transparent;
  color: ${({ active }) => (active ? "green" : "red")};
  border: 2px solid ${({ active }) => (active ? "green" : "red")};
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;

  &:hover {
    background-color: ${({ active }) =>
      active ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)"};
  }
`;

export default function Home() {
  const [isManual, setIsManual] = useState(false);
  const [isWeekend, setIsWeekend] = useState(true);

  return (
    <main className={styles.main}>
      <ButtonGroup>
        <ToggleButton
          isLeft
          active={!isManual}
          onClick={() => setIsManual(false)}
        >
          Automatisk
        </ToggleButton>
        <ToggleButton active={isManual} onClick={() => setIsManual(true)}>
          Manuell
        </ToggleButton>
      </ButtonGroup>
      <ButtonGroup>
        <ToggleButton
          isLeft
          active={!isWeekend}
          onClick={() => setIsWeekend(false)}
        >
          Mon - Fre
        </ToggleButton>
        <ToggleButton active={isWeekend} onClick={() => setIsWeekend(true)}>
          Övrig Tid
        </ToggleButton>
      </ButtonGroup>
      {isManual ? (
        <CalculateForm isWeekend={isWeekend} />
      ) : (
        <TaxiForm isWeekend={isWeekend} />
      )}
    </main>
  );
}
