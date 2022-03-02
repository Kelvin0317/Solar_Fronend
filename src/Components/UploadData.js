import React, {Component} from 'react';
import { Button, message } from 'antd';
import * as XLSX from 'xlsx';
import { DataGrid } from '@mui/x-data-grid';
import { CSVLink } from 'react-csv';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

const columns = [
  { field: 'id', headerName: 'No', width: 40 },
  { field: 'Date', headerName: 'Date', width: 120 },
  { field: 'Time', headerName: 'Time', width: 80 },
  {
    field: 'PV Energy',
    headerName: 'PV Energy',
    type: 'number',
    width: 110,
  },
  {
      field: 'Utility Import Energy',
      headerName: 'Utility Import Energy',
      type: 'number',
      width: 170,
  },
  {
      field: 'Utility Export Energy',
      headerName: 'Utility Export Energy',
      type: 'number',
      width: 170,
    }
];

const file = [{id: 0, Date: "Dec 1 2021", Time: ' 12:00AM', "PV Energy": 2, "Utility Import Energy": 2,"Utility Export Energy": 2 },{id: 1, Date: "Dec 1 2021", Time: ' 12:30AM', "PV Energy": 2, "Utility Import Energy": 2,"Utility Export Energy": 2 }]

class UploadData extends Component {
  constructor(props){
    // eslint-disable-next-line no-undef
    super(props);
    this.state = {
        Data : [],
        Download: [],
        BatteryPrice: [],
        InvertorPrice: [],
        Day:[],
        Roi:[],
        MDReduction:[],
        Each_Day_Saving:[]    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  ExcelDateToJSDate = (date) => {
    const length = this.state.Data.length;
    for (var i = 0; length > i; i++) {
        let converted_date = new Date(Math.round((this.state.Data[i]['Date'] - 25569) * 864e5));
        converted_date = String(converted_date).slice(4, 15)
        date = converted_date.split(" ")
        let day = date[1];
        let month = date[0];
        month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1
        if (month.toString().length <= 1)
            month = '0' + month
        let year = date[2];

        const month_text = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        console.log(month)
        this.state.Data[i]['Date'] = (String(month_text[month-1] + ' ' + parseInt(day) + ' ' + "20" + year.slice(2, 4)))
    } 
}

onImportExcel = file => {
    const { files } = file.target;
    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const { result } = event.target;
        const workbook = XLSX.read(result, { type: 'binary' });
        let data = [];
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          }
        }
        console.log(data);
        this.setState({
            Data:data
          })
      } catch (e) {
        message.error(' incorrect file type ！');
      }
    };
    fileReader.readAsBinaryString(files[0]);
}

  async postData() {
    const battery = this.state.BatteryPrice;
    const invertor = this.state.invertor;
    const md = this.state.MDReduction;
    const data = this.state.Data;
    console.log(battery)
    console.log(md)
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
        let result = await fetch('https://dry-cove-14847.herokuapp.com/', {
        method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([this.state.Data,this.state.BatteryPrice,this.state.InvertorPrice,this.state.MDReduction]),
      }).then(res =>{
        return res.json()
      }).then(res => {
        console.log(res)
        this.setState({
          Roi:res['roi'],
          Day:res['day'],
          Each_Day_Saving:res['saving_per_day']
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
        <div className="chart">  
        <button style={{width: "100%", margin: '10px auto', background: 'none', border:"1px solid lightgrey"}}>
            <CSVLink className='btn' data={file} filename={"Energy.csv"}>Download the template for fill In your data</CSVLink>
        </button>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Control type="file" accept='.xlsx, .xls' onChange={this.onImportExcel} />
        </Form.Group>
        <button style={{background: 'none', border:"1px solid lightgrey"}} onClick={this.ExcelDateToJSDate} variant="outline-grey">Optimization Date</button>
        <div style={{ height: 400, width: '100%', margin: "0px 0px 100px 0px" }}>
            <DataGrid
                rows={this.state.Data}
                columns={columns}
                pageSize={48}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
      </div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Invertor Price</Form.Label>
          <Form.Control 
            placeholder="Enter Invertor Price" 
            name="InvertorPrice"
            type="number"
            onChange={this.handleInputChange}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Battery Price</Form.Label>
          <Form.Control 
            placeholder="Enter Battery Price" 
            name="BatteryPrice"
            type="number"
            onChange={this.handleInputChange}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>MD Reduction</Form.Label>
          <Form.Control 
            placeholder="Enter MD Reduction" 
            name="MDReduction"
            type="number"
            onChange={this.handleInputChange}/>
        </Form.Group>
      </Form>
      <button id="mybtn" style={{border:"1px solid lightgrey", margin:"0px 0px 100px 0px"}} className='btn btn-success w-100' onClick={() => this.postData()}>Submit</button>
          <div style={{background: 'none', margin:'0 0 20px 0', border:"1px solid lightgrey"}}>
            <Bar
            onChange={this.handle}
              data = {{datasets: [{   
                type: 'bar',
                label: 'Day',
                data: this.state.Roi,
                borderColor: 'rgb(0, 199, 140)',
                backgroundColor: 'rgb(0, 199, 140)',
              }],
            labels: this.state.Day}}
            options = {{
              plugins: {
                title: {
                    display: true,
                    text: "ROI Per Days"
                }
            },
              scales: {y: { title: { display: true, text: 'Roi' }}}
            } 
            }
            />
            </div>
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
            },
              scales: {y: { title: { display: true, text: 'Saving (RM)' }}}
            } 
            }
           />
          </div>
          </div>
    )
  }
}

export default UploadData;