import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext';

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;

    return (
        <div className="col-md-3">
            <div class="card my-3">
                <div class="card-body">

                    {/* bootstrap align item center */}
                    <div className="d-flex align-items-center">
                        <h5 class="card-title">{note.title}</h5>

                        {/* using mx-2 class from bootstrap */}
                        {/* fontaweasome */}
                        <i className="far fa-trash-alt mx-2" onClick={()=>{deleteNote(note._id);
                        props.showAlert("Deleted","danger")}}></i>
                        <i class="fa-solid fa-pen-to-square" onClick={()=>{updateNote(note)}}></i>
                    </div>

                    <p class="card-text">{note.description}</p>


                </div>
            </div>
        </div>
    )
}

export default Noteitem

