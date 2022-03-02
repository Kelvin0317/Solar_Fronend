import React, {Component} from 'react';
import { Button, message } from 'antd';
import * as XLSX from 'xlsx';
import { DataGrid, GridAddIcon, visibleGridColumnsLengthSelector } from '@mui/x-data-grid';
import { CSVLink } from 'react-csv';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab';
import { margin } from '@mui/system';

class WhichData extends Component {
  constructor(props){
    // eslint-disable-next-line no-undef
    super(props);
    this.state = {
        input_date:[],
        date: [],
        kWh_Export_PV:[],
        kWh_Import_PV:[],
        kWh_Import_TNB:[],
        kW_Import_PV:[],
        kW_Import_TNB:[],
        day:[],
        load:[],
        time:[],
        Which:[]
        }
    this.handleInputChange = this.handleInputChange.bind(this);
        
    var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var month;
        var day;

        if(today.getMonth() < 10){
          month = "0" + (today.getMonth() + 1) 
        }else{
          month = today.getMonth() + 1 
        }
        
        if(today.getDate() < 10){
          day = "0" + today.getDate() 
        }else{
          day = today.getDate()  
        }

        date = today.getFullYear() + '-' + (month) + '-' + day;
        console.log(date)
        this.state = {
            date: date,
            Which: 'Day',
            input_date: date,
        };

        fetch('https://dry-cove-14847.herokuapp.com/Information', {
        method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([this.state.date,this.state.Which]),
        }).then(res =>{
          return res.json()
        }).then(res => {
          console.log(res);
          this.setState({
            kWh_Export_PV:res['kWh_Export_PV'],
            kWh_Import_PV:res['kWh_Import_PV'],
            kWh_Import_TNB:res['kWh_Import_TNB'],
            kW_Import_PV:res['kW_Import_PV'],
            kW_Import_TNB:res['kW_Import_TNB'],
            time:res['time'],
            load:res['load'],
            day:res['day']
          })
        })
  }

  async postData(e) {
    document.getElementById("Day").style.backgroundColor = "#6c757d";
    document.getElementById("Month").style.backgroundColor = "#6c757d";
    document.getElementById("Year").style.backgroundColor = "#6c757d";

    document.getElementById(e.target.id).style.backgroundColor = "#198754";
    this.setState({
      Which: e.target.name
    });

    try {
      let result = await fetch('https://dry-cove-14847.herokuapp.com/Information', {
        method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([this.state.input_date,this.state.Which]),
      }).then(res =>{
        return res.json()
      }).then(res => {
        this.setState({
          kWh_Export_PV:res['kWh_Export_PV'],
          kWh_Import_PV:res['kWh_Import_PV'],
          kWh_Import_TNB:res['kWh_Import_TNB'],
          kW_Import_PV:res['kW_Import_PV'],
          kW_Import_TNB:res['kW_Import_TNB'],
          time:res['time'],
          load:res['load'],
          day:res['day']
        })
      })
    } catch(e) {
        console.log(e)
      }
  }
    
  async handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    
    try {
      let result = await fetch('https://dry-cove-14847.herokuapp.com/Information', {
        method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([value,this.state.Which]),
      }).then(res =>{
        return res.json()
      }).then(res => {
        this.setState({
          kWh_Export_PV:res['kWh_Export_PV'],
          kWh_Import_PV:res['kWh_Import_PV'],
          kWh_Import_TNB:res['kWh_Import_TNB'],
          kW_Import_PV:res['kW_Import_PV'],
          kW_Import_TNB:res['kW_Import_TNB'],
          time:res['time'],
          load:res['load'],
          day:res['day']
        })
      })
    } catch(e) {
        console.log(e)
      }
  }

  handle(event) {
    const target = event.target;
    console.log(target)
  }
 
  render() {
    return(
      <div style={{width: '70%', margin: "25px auto"}}>
        <Tabs
          defaultActiveKey="Power_Trend"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Power_Trend" title="Power Trend">
          <Bar
          data = {{
              datasets: [{     
                  label: 'PV (Power)',
                  data: this.state.kW_Import_PV,
                  borderColor: '#1abb9b',
                  stack: 1,
                  backgroundColor: '#1abb9b',
              },
              {     
                type:"line",
                label: 'Load (Power)',
                data: this.state.load,
                borderColor: '#9abdc3',
                backgroundColor: '#9abdc3',
            },
              {   
                label: 'Utility-TNB (Power)',
                data: this.state.kW_Import_TNB,
                borderColor: '#3598db',
                stack: 1,
                backgroundColor: '#3598db',
            }],
                labels: this.state.time}}
                options = {{
                  responsive: true,
                  legend: {
                    display: false
                  },
                    scales: {
                      xAxes: [{
                          stacked: true
                      }],
                      yAxes: [{
                          stacked: true
                      }]
                  },plugins: {
                    title: {
                        display: true,
                        text: "Power Trend"
                    }
                },scales: {y: { title: { display: true, text: 'Powed Demand (kW)' }}}
                } 
                }
            />
          </Tab>
          <Tab eventKey="Energy_Trend" title="Enery Trend">
          <Bar
          data = {{
              datasets: [{     
                  label: 'PV (Self-Consumption)',
                  data: this.state.kWh_Import_PV,
                  borderColor: '#1abb9b',
                  stack: 1,
                  backgroundColor: '#1abb9b',
              },
              {   
                label: 'Utility-TNB (Purchased Energy)',
                data: this.state.kWh_Import_TNB,
                borderColor: '#3598db',
                stack: 1,
                backgroundColor: '#3598db',
            }],
                labels: this.state.time}}
                options = {{
                  responsive: true,
                  legend: {
                    display: false
                  },
                    scales: {
                      xAxes: [{
                          stacked: true
                      }],
                      yAxes: [{
                          stacked: true
                      }]
                  },plugins: {
                    title: {
                        display: true,
                        text: "Energy Trend"
                    }
                },scales: {y: { title: { display: true, text: 'Energy (kWh)' }}}
                } 
                }
            />
          </Tab>
        </Tabs>
        <div className='d-flex w-100 mt-5 '>
          <div>
            <Form>
              <div className='d-flex'>
                <Form.Control style={{width: '100%'}} type="date" name='input_date' onChange={this.handleInputChange}/>
              </div>
            </Form>
          </div>
          <div className='d-flex'>
            <button id='Day' name='Day' style={{border:"1px solid lightgrey", margin: "auto 10px"}} disabled={this.state.disabled_day} onClick={(e) => this.postData(e)} className='btn btn-success'>Day</button>
            <button id='Month' name='Month' style={{border:"1px solid lightgrey", margin: "auto auto"}} disabled={this.state.disabled_month} onClick={(e) => this.postData(e)} className='btn btn-secondary'>Month</button>
            <button id='Year' name='Year' style={{border:"1px solid lightgrey", margin: "auto 10px"}} disabled={this.state.disabled_year} onClick={(e) => this.postData(e)} className='btn btn-secondary'>Year</button>
          </div>
        </div>
      </div>
        
    )
  }
}

export default WhichData;