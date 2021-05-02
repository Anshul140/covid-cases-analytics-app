import React, { useEffect, useState } from 'react';
import './App.css';
import { FormControl, MenuItem, Select, CardContent, Card } from '@material-ui/core';
import InfoBox from './components/InfoBox'
import Map from './components/Map';
import Table from './components/Table'
import { prettyPrintStat, sortData } from './utilityComponents/util';
import "leaflet/dist/leaflet.css"
import LineGraph from './components/LineGraph';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746,-40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
      fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
          setCountryInfo(data);
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));


          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);

          setMapCountries(data);
        })
    }

    getCountriesData();
  }, []);
  //[]- empty array means code inside useEffect will run once when the component loads and not again

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    // console.log("CountryCode:", countryCode);
    setCountry(countryCode);

    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    //https://disease.sh/v3/covid-19/all

    const url = countryCode === 'worldwide'
     ? 'https://disease.sh/v3/covid-19/all'
     : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

     await fetch(url)
     .then(response => response.json())
     .then(data => {
         setCountry(countryCode);
         setCountryInfo(data);

        //  console.log("Coordinates:",data.countryInfo.lat, data.countryInfo.long)

         countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
     });
  };

  // console.log("Country Info", countryInfo);
  // console.log("Tabledata:", tableData);
  console.log("SortedData:", tableData);

  return (
    <div className="app">
      <div className="app_left">
         <div className="app_header">
          <h1>COVID-CASES ANALYTICS</h1>
          <FormControl className="app__dropdown">
            <Select 
              variant="outlined" 
              value={country} 
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}

            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* Infoboxs title="Coronavirus cases" */}
          {/* Infoboxs title="coronavirus recoveries" */}
          {/* Infoboxs */}

          <InfoBox 
              active={casesType === "cases"}
              isRed
              onClick={(e) => setCasesType("cases")}
              title="COVID-Cases" 
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={countryInfo.cases}
          />
          <InfoBox 
              active={casesType === "recovered"}
              onClick={(e) => setCasesType("recovered")}
              title="Recovered" 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={countryInfo.recovered} 
          />
          <InfoBox 
              active={casesType === "deaths"}
              isRed
              onClick={(e) => setCasesType("deaths")}
              title="Deaths" 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={countryInfo.deaths} 
          />
        </div>

        {/* Map */}
        <Map 
           casesType={casesType}
           countries={mapCountries}
           center={mapCenter}
           zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
          {/* Graphs */}
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
