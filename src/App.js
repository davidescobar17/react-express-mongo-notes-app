import './App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'wc-toast';
import TextareaAutosize from 'react-textarea-autosize';

function App(){

  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingId, setIsEditingId] = useState(false);

  const [updatedNoteText, setUpdatedNoteText] = useState("");

  const notifySuccessful = (text) => {
    toast.success(text);
  };

  const fetchData = () => {
    axios.get(`http://localhost:5000/getnotes`)
      .then(res => {

      const persons = res.data;
        setNotes(persons);
      }).catch((error) => {
      // Error
      if(error.response){
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      else if(error.request){
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the 
        // browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      }
      else{
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {

    // don't refresh the page (if on form)
    e.preventDefault();

    axios.post(`http://localhost:5000/addnote`, {noteText: newNoteText})
    .catch((error) => {
      if(error.response){

        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      else if(error.request){

        console.log(error.request);
      }
      else{

        console.log('Error', error.message);
      }

      console.log(error.config);
    })
    .then(() => fetchData())
    .then(() => notifySuccessful("Added note"));
  }

  const handleDelete = (id) => {

    axios.post(`http://localhost:5000/deletenote`, id)
    .catch((error) => {
      if(error.response){

        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      else if(error.request){

        console.log(error.request);
      }
      else{

        console.log('Error', error.message);
      }

      console.log(error.config);
    })
    .then(() => fetchData())
    .then(() => notifySuccessful("Deleted note"));
  }

  const handleEdit = () => {

    axios.post(`http://localhost:5000/editnote`, {id: isEditingId, note: updatedNoteText})
    .catch((error) => {
      if(error.response){

        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      else if(error.request){

        console.log(error.request);
      }
      else{

        console.log('Error', error.message);
      }

      console.log(error.config);
    })
    .then(() => fetchData())
    .then(() => setIsEditing(false))
    .then(() => notifySuccessful("Note edited"));
  }

  return (
  <div className="App">

    <wc-toast></wc-toast>

    <header className="App-header">

      <p style={{whiteSpace: "pre-wrap"}}>
        Add, edit and delete notes with Express and MongoDB.
      </p>

      <form onSubmit={handleSubmit} style={{display:'flex', alignItems:'center', marginBottom:'1rem'}}>
        <TextareaAutosize type="text" value={newNoteText} onChange={(event) => setNewNoteText(event.target.value)} style={{resize: "none"}}/>
        <input type="submit" value="+" className="btn btn-primary" style={{marginLeft:'1rem', fontSize: "1.6rem"}}/>
      </form>

      <table className="table table-bordered table-dark" style={{width:"99%"}}>
        <thead>
        <tr>
          <th> Note </th>
          <th> Actions </th>
        </tr>
        </thead>
        <tbody>
          {
            notes.map(
              note =>
              <tr key = {note._id}> 
                {
                  isEditing && note._id === isEditingId?

                  <td style={{width:"90%", height:"100%"}}>
                    <TextareaAutosize autoFocus type="text" value={updatedNoteText} onChange={(event) => setUpdatedNoteText(event.target.value)}
                      onFocus={function(e){
                        var val = e.target.value;
                        e.target.value = '';
                        e.target.value = val;
                      }}
                      style={{width:"100%", resize:"none"}}
                    />
                  </td>
                  :
                  <td style={{width:"90%", height:"100%"}}> {note.name} </td>
                }
                  <td className='align-middle'>
                  <div className="container d-flex justify-content-center">
                  {
                    isEditing && note._id === isEditingId?

                    <div>
                      <button className = "btn btn-secondary" onClick = {(e) => {e.target.blur(); setIsEditing(false);}}
                        style = {{marginLeft:"10px", fontSize: "1rem"}}> Cancel </button>
                      <button className = "btn btn-success" onClick = {(e) => {e.target.blur(); handleEdit();}}
                        style = {{marginLeft:"10px", fontSize: "1rem"}}> Save </button>
                    </div>
                    :
                    <div>
                      <button className = "btn btn-secondary" onClick = {(e) => {e.target.blur();
                        setUpdatedNoteText(note.name); setIsEditing(true); setIsEditingId(note._id);}}
                        style = {{marginLeft:"10px", fontSize: "1rem"}}> Edit </button>
                      <button className = "btn btn-danger" onClick = {(e) => {e.target.blur(); handleDelete(note._id);}}
                        style = {{marginLeft:"10px", fontSize: "1rem"}}> Delete </button>
                    </div>
                  }
                </div>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </header>
  </div>
  );
}

export default App;
