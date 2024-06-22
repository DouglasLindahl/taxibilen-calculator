import Image from "next/image";
import styles from "./page.module.css";
import TaxiForm from "@/components/taxiForm/page";
import CalculateForm from "@/components/calculateForm/page";

export default function Home() {
  return (
    <main className={styles.main}>
      <TaxiForm></TaxiForm>
      <CalculateForm></CalculateForm>
    </main>
  );
}
