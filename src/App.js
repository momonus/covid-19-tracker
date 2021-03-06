import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

function App() {
  const[countries,setCountries] = useState([]);
  const[country,setInputCountry] = useState('worldwide');
  const[countryInfo,setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  },[]);


  useEffect(()=>{
    const getContriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name:country.country,
            value: country.countryInfo.iso2
          }));
          let sortedData = sortData(data);
          setTableData(sortedData); 
          setCountries(countries);
        });
    };

    getContriesData();
  },[]);

  const onCountryChang = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setInputCountry(countryCode);
          setCountryInfo(data);
    });
  };


   return (
    <div className="app">
      <dev className="app_left">
      <div className="app_header">
        <h1> COVID-19 TRACKER </h1>
        <FormControl className="app_dropdown">
        <Select variant="outlined" onChange={onCountryChang}value={country}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map((country)=>(
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
       </div>
       <div className="app_stats">
         <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases}total={countryInfo.cases}/>
         <InfoBox title="Recovered"cases={countryInfo.todayRecovered}total={countryInfo.recovered}/>
         <InfoBox title="Deaths"cases={countryInfo.todayDeaths}total={countryInfo.deaths}/>
       </div>
       <Map/>
      </dev>
      <Card className="app_right">
      <CardContent>
        <h2>Live Cases by Country</h2>
        <Table countries={tableData}/>
        <h2>Worldwide new</h2>
        <LineGraph/>
      </CardContent>
      </Card>
    </div>
  );
}

export default App;
 