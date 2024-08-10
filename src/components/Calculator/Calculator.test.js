import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Calculator from "./Calculator";
import { BrowserRouter } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));
const { useTranslation } = require("react-i18next");
useTranslation.mockReturnValue({
  t: (key) => {
    const translations = {
      en: {
        title: "Calculate your potential gains",
        enterDetails: "Enter your details",
        initialContribution: "Initial contribution",
        timeframe: "Timeframe (y)",
        annualRate: "Annual rate (%)",
        contribution: "Contribution",
        period: "Period",
        monthly: "Monthly",
        quarterly: "Quarterly",
        yearly: "Yearly",
        calculateButton: "Calculate",
        yourResults: "Your results",
        initialDeposit: "Initial deposit",
        projectedReturns: "Projected returns",
        learnMore: "Learn more about this calculation",
      },
      fr: {
        title: "Calculez vos gains potentiels",
        enterDetails: "Entrez vos détails",
        initialContribution: "Contribution initiale",
        timeframe: "Durée (ans)",
        annualRate: "Taux annuel (%)",
        contribution: "Contribution",
        period: "Période",
        monthly: "Mensuel",
        quarterly: "Trimestriel",
        yearly: "Annuel",
        calculateButton: "Calculer",
        yourResults: "Vos résultats",
        initialDeposit: "Dépôt initial",
        projectedReturns: "Rendements projetés",
        learnMore: "En savoir plus sur ce calcul",
      },
    };
    return translations["fr"][key] || key;
  },
  i18n: {
    changeLanguage: jest.fn().mockResolvedValue(),
    language: "fr",
  },
});
test("should match snapshot", () => {
  const { asFragment } = render(
    <BrowserRouter>
      <Calculator />
    </BrowserRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

test("test some texts are being rendered right", () => {
  render(
    <BrowserRouter>
      <Calculator />
    </BrowserRouter>
  );
  expect(screen.getByLabelText(/Initial Contribution/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Time Frame/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Annual Rate/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Calculer/i })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /Entrez vos détails/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /Vos résultats/i })
  ).toBeInTheDocument();
});

test("test calculating process", () => {
  render(
    <BrowserRouter>
      <Calculator />
    </BrowserRouter>
  );
  fireEvent.change(screen.getByLabelText("Initial Contribution"), {
    target: { value: "1000" },
  });
  fireEvent.change(screen.getByLabelText("Time Frame"), {
    target: { value: "5" },
  });
  fireEvent.change(screen.getByLabelText("Annual Rate"), {
    target: { value: "4" },
  });
  fireEvent.change(screen.getByLabelText("Contribution"), {
    target: { value: "50" },
  });
  fireEvent.change(screen.getByLabelText("Period"), {
    target: { value: "Mensuel" },
  });
  fireEvent.click(screen.getByText(/Calculer/i));
  expect(screen.getByText(/Dépôt initial:/i)).toHaveTextContent("1 000.00 €");
  expect(screen.getByText(/Rendements projetés:/i)).toHaveTextContent(
    "535.95 €"
  );
});

test("test for changing language and resets states", () => {
  render(
    <BrowserRouter>
      <Calculator />
    </BrowserRouter>
  );
  fireEvent.change(screen.getByLabelText("Initial Contribution"), {
    target: { value: "1000" },
  });
  fireEvent.change(screen.getByLabelText("Time Frame"), {
    target: { value: "5" },
  });
  fireEvent.change(screen.getByLabelText("Annual Rate"), {
    target: { value: "4" },
  });
  fireEvent.change(screen.getByLabelText("Contribution"), {
    target: { value: "50" },
  });
  fireEvent.click(screen.getByAltText("Francais"));

  // The value is null because the empty string is interpreted as null. If we modify the resetStates() function in Calculator to setInitialContribution("1"); instead of "", then it will return "1" instead of null.
  expect(screen.getByLabelText("Initial Contribution")).toHaveValue(null);
  expect(screen.getByLabelText("Time Frame")).toHaveValue(null);
  expect(screen.getByLabelText("Annual Rate")).toHaveValue(null);
  expect(screen.getByLabelText("Contribution")).toHaveValue(null);
});

test("test invalid input", () => {
  render(
    <BrowserRouter>
      <Calculator />
    </BrowserRouter>
  );
  fireEvent.change(screen.getByLabelText("Initial Contribution"), {
    target: { value: "abc" },
  });
  fireEvent.click(screen.getByText(/Calculez/i));
  expect(screen.getByText(/Dépôt initial:/i)).toHaveTextContent("0.00 €");
});

test("should render in fr", () => {
  render(
    <BrowserRouter>
      <Calculator />
    </BrowserRouter>
  );
  expect(screen.getByText("Calculez vos gains potentiels")).toBeInTheDocument();
});