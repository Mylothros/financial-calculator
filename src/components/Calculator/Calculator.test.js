import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Calculator from "./Calculator";
import { BrowserRouter } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn().mockResolvedValue(), 
    },
  })
}));

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
  expect(screen.getByRole('button', { name: /calculateButton/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /enterDetails/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /yourResults/i })).toBeInTheDocument();
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
    target: { value: "Monthly" },
  });
  fireEvent.click(screen.getByText(/Calculate/i));
  expect(screen.getByText(/initialDeposit:/i)).toHaveTextContent("£1.000.00");
  expect(screen.getByText(/projectedReturns:/i)).toHaveTextContent("£535.95");
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

  // null because the "" is being intrepeted to null, if we change resetStates() in calculator to  setInitialContribution("1"); then it wont reutrn null but 1
  expect(screen.getByLabelText("Initial Contribution")).toHaveValue(null); 
  expect(screen.getByLabelText("Time Frame")).toHaveValue(null);
  expect(screen.getByLabelText("Annual Rate")).toHaveValue(null);
  expect(screen.getByLabelText("Contribution")).toHaveValue(null);
});

test('test invalid input', () => {
    render(
      <BrowserRouter>
        <Calculator />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText("Initial Contribution"), {
        target: { value: "abc" },
      });
    fireEvent.click(screen.getByText(/Calculate/i));
    expect(screen.getByText(/initialDeposit:/i)).toHaveTextContent('£0.00');
  });