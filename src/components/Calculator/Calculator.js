import React, { useState } from "react";
import "./Calculator.scss";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const Calculator = () => {
  const [initialContribution, setInitialContribution] = useState("");
  const [timeFrame, setTimeFrame] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [contribution, setContribution] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [results, setResults] = useState({ deposit: 0, returns: 0 });

  const { t, i18n } = useTranslation();
  const location = useLocation();
  const language = i18n.language;
  const languageCurrencyLocaleMap = {
    en: {
      currency: "GBP",
      locale: "en-GB",
    },
    fr: {
      currency: "EUR",
      locale: "fr-FR",
    },
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    resetStates();
    //I will not use an API to convert currency between French and UK currencies, or for other conversions, I will reset all states whenever the language changes
  };

  const resetStates = () => {
    setInitialContribution("");
    setTimeFrame("");
    setAnnualRate("");
    setContribution("");
    setPeriod("Monthly");
    setResults({ deposit: 0, returns: 0 });
  };

  const calculateReturns = () => {
    console.log("again");
    let n;
    if (period === "Monthly") {
      n = 12;
    } else if (period === "Quarterly") {
      n = 4;
    } else {
      n = 1;
    }
    const t = timeFrame;
    const r = annualRate / 100;
    const P = initialContribution;
    const PMT = contribution;
    const A =
      P * Math.pow(1 + r / n, n * t) +
      PMT * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    const R = A - (P + PMT * n * t);
    setResults({
      deposit: P,
      returns: isNaN(R) ? 0 : R,
    });
  };

  const handleChange = (setter, max) => (e) => {
    const value = +e.target.value; //we add + to convert it automatically to a number
    if (value > max) {
      setter(max);
    } else {
      setter(value || ""); //we have the || so if the value is 0 which is false the placeholder will take again the place
    }
  };

  const respectiveCurrency = (value) => {
    const { currency, locale } = languageCurrencyLocaleMap[language];
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace(/\s/g, " ")
      .replace(",", ".");
  };

  const getCurrencySymbol = () => {
    const { currency, locale } = languageCurrencyLocaleMap[language];
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency").value;
  };

  return (
    <div className="container">
      <div className="calculator-container">
        <div className="language-switch">
          <h1>{t("title")}</h1>{" "}
          <Link
            to={{ pathname: "/en", search: location.search }}
            onClick={() => changeLanguage("en")}
          >
            <img src="/images/england.png" alt="English" />
          </Link>
          <Link
            to={{ pathname: "/fr", search: location.search }}
            onClick={() => changeLanguage("fr")}
          >
            <img src="/images/france.png" alt="Francais" />
          </Link>
        </div>
        <div className="calculator">
          <div className="calculator-inputs">
            <h2>{t("enterDetails")}</h2>
            <label>
              {t("initialContribution")} ({getCurrencySymbol()}){" "}
              <input
                type="number"
                value={initialContribution}
                onChange={handleChange(setInitialContribution)}
                placeholder="0"
                min="0"
                step="100"
              />
            </label>
            <label>
              {t("timeframe")}{" "}
              <input
                type="number"
                value={timeFrame}
                onChange={handleChange(setTimeFrame, 100)}
                placeholder="0"
                max="100"
                min="0"
                step="1"
              />
            </label>
            <label>
              {t("annualRate")}{" "}
              <input
                type="number"
                value={annualRate}
                onChange={handleChange(setAnnualRate, 10)}
                placeholder="0"
                max="10"
                min="0"
                step="0.1"
              />
            </label>
            <div className="contribution-container">
              <label>
                {t("contribution")} ({getCurrencySymbol()}){" "}
                <input
                  type="number"
                  value={contribution}
                  onChange={handleChange(setContribution)}
                  placeholder="0"
                  min="0"
                  step="50"
                />
              </label>
              <label>
                {t("period")}{" "}
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="Monthly">{t("monthly")}</option>
                  <option value="Quarterly">{t("quarterly")}</option>
                  <option value="Yearly">{t("yearly")}</option>
                </select>
              </label>
            </div>
            <button onClick={calculateReturns}>{t("calculateButton")}</button>
          </div>
          <div className="calculator-results">
            <h2>{t("yourResults")}</h2>
            <div className="calculator-image">
              <img
                src="/images/happy-person.svg"
                alt="Calculator illustration"
              />
            </div>
            <div className="results-container">
              <p className="initial-deposit">
                {t("initialDeposit")}:{" "}
                <span className="money">
                  {respectiveCurrency(results.deposit)}
                </span>
              </p>
              <p className="projected-returns">
                {t("projectedReturns")}:{" "}
                <span className="money">
                  {respectiveCurrency(results.returns)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <a href="https://withplum.com/" target="_blank" rel="noopener noreferrer">
        {t("learnMore")}
      </a>
    </div>
  );
};
export default Calculator;