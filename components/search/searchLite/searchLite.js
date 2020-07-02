import React, { Component } from 'react';
import { render } from 'react-dom';
import Suggestion from 'search-suggestion';
import { searchDoctorsLite } from "../../../services/api"
import  Search  from "../../assets/search";

//const items = ['apple', 'pear', 'orange', 'grape', 'banana'];
 
class SearchLite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentData: []
    };
  }
 
  createData = (word, data) => {
    const re = new RegExp(`${word.toLowerCase()}.*\\B`, 'g');
    return data.filter(item => re.test(item.toLowerCase()));
  };
 
  handleChange = e => {
    const value = e.target.value;
    const search ={
			match:'{}',
			name:value
		};
    searchDoctorsLite(search).then(res=>{
      let items = res.data.data.map( (resl, i) =>  {return  resl.basic.name});
			console.log(items);
			
			this.setState({currentData:items});
    }).catch(err=>console.log(err));
  };
 
  render() {
    return (
    
      <Suggestion
        getDisplayName={item => item}
        items={this.state.currentData}
        onSelectedItem={item => alert(item)}
      >
        {({
          getInputProps,
          getListItemProps,
          getItemProps,
          inputValue,
          selectedItem,
          highlightedIndex,
          items,
          isOpen,
          clearInputValue
        }) => (
          <div>
            <p>selected item: {selectedItem}</p>
            <input
              {...getInputProps({
                placeholder: 'Select fruit',
                onChange: this.handleChange
              })}
            />
            {isOpen && (
              <div {...getListItemProps()}>
                {items.map((item, index) => (
                  <div
                    {...getItemProps({ item, index })}
                    key={item.code}
                    style={{
                      backgroundColor:
                        highlightedIndex === index
                          ? 'rgb(232, 232, 232)'
                          : 'white',
                      fontWeight:
                        selectedItem && selectedItem === item
                          ? 'bold'
                          : 'normal'
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Suggestion>
    
    );
  }
}
export default SearchLite