import React, {Component} from 'react';
import { Button, message } from 'antd';
import * as XLSX from 'xlsx';
import { DataGrid, GridAddIcon, visibleGridColumnsLengthSelector } from '@mui/x-data-grid';
import { CSVLink } from 'react-csv';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

class UploadData extends Component {
  constructor(props){
    // eslint-disable-next-line no-undef
    super(props);
    this.state = {
        BatteryPrice: [],
        InvertorPrice: [],
        Day:[],
        Roi:[],
        MDReduction:[],
        Each_Day_Saving:[],
        date_1:[],
        date_2:[],
        Chart_day:0,
        Battery_Capacity:[],
        Investment_Cost:[],
        Saving_Per_Year:[],
        Saving_Chart_day:[]
        }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async postData() {
    const battery = this.state.BatteryPrice;
    const invertor = this.state.invertor;
    const md = this.state.MDReduction;
    const data = this.state.Data;
    const date_1 = this.state.date_1;
    const date_2 = this.state.date_2;
    if(data === 0){
      alert("Please upload your data");
    }else if(invertor === 0){
      alert("Invertor Price can't be empty");
    }else if(battery === 0){
      alert("Battery Price can't be empty");
    }else if(md === 0){
      alert("MD Deruction can't be empty");
    }
    if(battery !== 0 && invertor !== 0 && data !== 0 && md !== 0){
      try {
        let result = await fetch('http://127.0.0.1:5000//realtime', {
        method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([this.state.BatteryPrice,this.state.InvertorPrice,this.state.MDReduction,this.state.date_1,this.state.date_2]),
      }).then(res =>{
        return res.json()
      }).then(res => {
        console.log(res)
        this.setState({
          Roi:res['roi'],
          Day:res['day'],
          Each_Day_Saving:res['saving_per_day'],
          Saving_Per_Year:res['saving_per_year'],
          Investment_Cost:res['investment'],
          Battery_Capacity:res['battery_capacity']
        })
        console.log(res);
      })
    } catch(e) {
        console.log(e)
      }
    }
  }
    
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handle(event) {
    const target = event.target;
    console.log(target)
  }
 
  render() {
    return(
      <div style={{width: '70%', margin: "25px auto"}}>
        <Form>
            <Form.Group className="mb-3">
            <Form.Label>Invertor Price</Form.Label>
            <Form.Control 
                placeholder="Enter Invertor Price" 
                name="InvertorPrice"
                type="number"
                onChange={this.handleInputChange}/>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Battery Price</Form.Label>
            <Form.Control 
                placeholder="Enter Battery Price" 
                name="BatteryPrice"
                type="number"
                onChange={this.handleInputChange}/>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>MD Reduction</Form.Label>
            <Form.Control 
                placeholder="Enter MD Reduction" 
                name="MDReduction"
                type="number"
                onChange={this.handleInputChange}/>
            </Form.Group>
            <div>
                <Form.Label>Date</Form.Label>
                <div className='d-flex mb-5'>
                    <Form.Control style={{width: '40%'}} type="date" name='date_1' onChange={this.handleInputChange}/>
                    <Form.Label className='text-center pt-2' style={{width: '20%'}}>To</Form.Label>
                    <Form.Control style={{width: '40%'}} type="date" name='date_2' onChange={this.handleInputChange}/>
                </div>
            </div>
        </Form>
        <button id="mybtn" style={{border:"1px solid lightgrey", margin:"0px 0px 100px 0px"}} className='btn btn-success w-100' onClick={() => this.postData()}>Submit</button>
            <div style={{background: 'none', margin:'0 0 20px 0', border:"1px solid lightgrey"}}>
                <Bar
                onChange={this.handle}
                data = {{datasets: [{ type: 'bar', label: 'Day', data: this.state.Roi, borderColor: 'rgb(0, 199, 140)',     backgroundColor: 'rgb(0, 199, 140)', fill: true
            }],
                labels: this.state.Day}}
                options = {{
                    plugins: {
                        title: {
                            display: true,
                            text: "ROI Per Days"
                        }
                    },onClick: (e) => {
                        const length = this.state.Day.length
                        let i = 0;
                        let day = -1;
                        let x = e.chart.chartArea.left;
                        while(length > i){
                            const add = (e.chart.chartArea.right - e.chart.chartArea.left)/length
                            if(e.x > x){
                                day += 1
                                this.setState({
                                    Chart_day: day,
                                  })
                                }
                            x += add;
                            i += 1;
                        }
                        console.log(this.state.Chart_day)
                    },tooltips: {
                        mode: 'index',
                        intersect: false
                     },
                    hover: {
                        mode: 'index',
                        intersect: true
                     },
                    scales: {y: { title: { display: true, text: 'Roi' }}}
                }}
                />
            </div>
            <Card style={{ width: '100%' }}>
              <Card.Header>{this.state.Day[this.state.Chart_day]}</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>Saving Per Year = RM{this.state.Saving_Per_Year[this.state.Chart_day]}</ListGroup.Item>
                <ListGroup.Item>Battery Capacity = {this.state.Battery_Capacity[this.state.Chart_day]} (kWh)</ListGroup.Item>
                <ListGroup.Item>Investment Cost = RM{this.state.Investment_Cost[this.state.Chart_day]}</ListGroup.Item>
                <ListGroup.Item>ROI = {this.state.Roi[this.state.Chart_day]}</ListGroup.Item>
              </ListGroup>
            </Card>
                <div style={{background: 'none', border:"1px solid lightgrey"}}>
                <Bar
                data = {{datasets: [{   
                    type: 'line',
                    label: 'Day',
                    data: this.state.Each_Day_Saving,
                    borderColor: 'rgb(0, 199, 140)',
                    backgroundColor: 'rgb(0, 199, 140)',
                }],
                labels: this.state.Day}}
                options = {{
                plugins: {
                    title: {
                        display: true,
                        text: "Saving Per Day"
                    }
                },onClick: (e) => {
                  const length = this.state.Day.length
                  let i = 0;
                  let day = -1;
                  let x = e.chart.chartArea.left;
                  while(length > i){
                      const add = (e.chart.chartArea.right - e.chart.chartArea.left)/length
                      if(e.x > x){
                          day += 1
                          this.setState({
                            Saving_Chart_day: day,
                            })
                          }
                      x += add;
                      i += 1;
                  }
                  console.log(this.state.Saving_Chart_day)
              },tooltips: {
                  mode: 'index',
                  intersect: false
               },
              hover: {
                  mode: 'index',
                  intersect: true
               },
                scales: {y: { title: { display: true, text: 'Saving (RM)' }}}
                } 
                }
            />
            <Card style={{ width: '100%' }}>
              <Card.Header>{this.state.Day[this.state.Chart_day]}</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>Total Saving = RM{this.state.Each_Day_Saving[this.state.Saving_Chart_day]}</ListGroup.Item>
              </ListGroup>
            </Card>
            </div>
          </div>
    )
  }
}

export default UploadData;