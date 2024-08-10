import React, { useState, useEffect, useMemo } from "react";
import "./Calculator.scss";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router-dom";

const Calculator = () => {
  const [initialContribution, setInitialContribution] = useState("");
  const [timeFrame, setTimeFrame] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [contribution, setContribution] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [results, setResults] = useState({ deposit: 0, returns: 0 });

  const { t, i18n } = useTranslation();
  const { lang } = useParams();
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

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const changeLanguage = (lng, translationsValues) => {
    i18n.changeLanguage(lng);
    resetStates(translationsValues);
    //I will not use an API to convert currency between French and UK currencies, or for other conversions, I will reset all states whenever the language changes
  };

  const resetStates = (translationsValues) => {
    setInitialContribution("");
    setTimeFrame("");
    setAnnualRate("");
    setContribution("");
    setPeriod(translationsValues("monthly"));
    setResults({ deposit: 0, returns: 0 });
  };

  const calculateReturns = (translationsValues) => {
    if (!initialContribution || !timeFrame || !annualRate || !contribution)
      return;
    let n;
    if (period === translationsValues("monthly")) {
      n = 12;
    } else if (period === translationsValues("quarterly")) {
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
    const { currency, locale } =
      languageCurrencyLocaleMap[language] || languageCurrencyLocaleMap["en"];
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

  const getCurrencySymbol = useMemo(() => {
    const { currency, locale } =
      languageCurrencyLocaleMap[language] || languageCurrencyLocaleMap["en"];
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency").value;
  }, [language]);

  const formattedDeposit = useMemo(
    () => respectiveCurrency(results.deposit),
    [language, results]
  );
  const formattedReturns = useMemo(
    () => respectiveCurrency(results.returns),
    [language, results]
  );

  return (
    <div className="container">
      <div className="calculator-container">
        <div className="language-switch">
          <h1>{t("title")}</h1>{" "}
          <Link
            to={{ pathname: "/en", search: location.search }}
            onClick={() => changeLanguage("en", t)}
          >
            <img src="/images/england.png" alt="English" />
          </Link>
          <Link
            to={{ pathname: "/fr", search: location.search }}
            onClick={() => changeLanguage("fr", t)}
          >
            <img src="/images/france.png" alt="Francais" />
          </Link>
        </div>
        <div className="calculator">
          <div className="calculator-inputs">
            <h2>{t("enterDetails")}</h2>
            <label>
              {t("initialContribution")} ({getCurrencySymbol}){" "}
              <input
                type="number"
                value={initialContribution}
                onChange={handleChange(setInitialContribution)}
                placeholder="0"
                min="0"
                step="100"
                aria-label="Initial Contribution"
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
                aria-label="Time Frame"
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
                aria-label="Annual Rate"
              />
            </label>
            <div className="contribution-container">
              <label>
                {t("contribution")} ({getCurrencySymbol}){" "}
                <input
                  type="number"
                  value={contribution}
                  onChange={handleChange(setContribution)}
                  placeholder="0"
                  min="0"
                  step="50"
                  aria-label="Contribution"
                />
              </label>
              <label>
                {t("period")}{" "}
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  aria-label="Period"
                >
                  <option value={t("monthly")}>{t("monthly")}</option>
                  <option value={t("quarterly")}>{t("quarterly")}</option>
                  <option value={t("yearly")}>{t("yearly")}</option>
                </select>
              </label>
            </div>
            <button onClick={() => calculateReturns(t)}>
              {t("calculateButton")}
            </button>
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
                <span className="money">{formattedDeposit}</span>
              </p>
              <p className="projected-returns">
                {t("projectedReturns")}:{" "}
                <span className="money">{formattedReturns}</span>
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