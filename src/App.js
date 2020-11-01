import React, { useEffect, useState } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';

function App() {
  const[countries,setCountries] = useState([]);
  const[country,setCountry] = useState('worldwide');


  useEffect(()=>{
    const getContriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name:country.country,
            value: country.countryInfo.iso2
          }));

          setCountries(countries);
        });
    };

    getContriesData();
  },[]);

  const onCountryChang = (event) => {
    const countryCode = event.target.value;

    console.log("YOOO >>>>",countryCode);

    setCountry(countryCode);
  };

   return (
    <div className="App">
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
         <InfoBox title="Coronavirus Cases" cases={123}total={2000}/>
         <InfoBox title="Recovered"cases={1234}total={3000}/>
         <InfoBox title="Deaths"cases={12345}total={4000}/>
       </div>
       <Map>
         
       </Map>
    </div>
  );
}

export default App;
 