import { html } from "htm/preact";
import { Select, MenuItem } from "@mui/material";

type Props = {
  dates: number[][];
  onChange: any;
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function DateSelector({ dates, onChange }: Props) {
  return html`
    <${Select} onChange=${onChange}>
      ${dates.length > 0
        ? dates.map((datePair, index) => {
            const [startTimestamp] = datePair;
            const monthAndYear = capitalizeFirstLetter(
              new Date(startTimestamp).toLocaleString("es-ES", {
                month: "long",
                year: "numeric",
              })
            );
            return html`
              <${MenuItem} key=${index} value=${datePair}> ${monthAndYear} <//>
            `;
          })
        : html`
            <${MenuItem} disabled value=${0}>No hay fechas disponibles<//>
          `}
    <//>
  `;
}
