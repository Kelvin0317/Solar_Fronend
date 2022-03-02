import React, { Component } from 'react';
import UploadData from './Components/UploadData';
import RealtimeData from './Components/RealtimeData';
import Information from './Components/Information';
import Select from 'react-select';

const options = [
  { value: 'Upload Data', label: 'Upload Data' },
  { value: 'Realtime Data', label: 'Realtime Data By Day' },
  { value: 'Information', label: 'Information' }
];
class App extends Component {
  state = {
    selectedOption: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      Page: []
    }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    if(selectedOption.value == "Upload Data"){
      this.state.Page = "Upload Data"
      console.log(this.state.Page)
    }
    if(selectedOption.value == "Realtime Data"){
      this.state.Page = "Realtime Data"
      console.log(this.state.Page)
    }
    if(selectedOption.value == "Information"){
      this.state.Page = "Information"
      console.log(this.state.Page)
    }
  };

  render(){
    const { selectedOption } = this.state;

    return(
      <div>
        <div className="App" style={{width: "70%", margin: 'auto'}}>
          <Select 
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
          />  
        </div>   
        {this.state.Page === "Upload Data" && (
          <UploadData/>    
        )}
        {this.state.Page === "Realtime Data" && (
          <RealtimeData/>    
        )}
        {this.state.Page === "Information" && (
          <Information/>    
        )}
      </div>
    );
  }
}

export default App;
