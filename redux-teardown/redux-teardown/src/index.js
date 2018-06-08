import React from 'react';
import ReactDOM from 'react-dom';

const initialState = {
  nextNoteId: 1,
  notes: {}
}

window.state = initialState

const onAddNote = () => {
  const id = window.state.nextNoteId

  window.state.notes[id] = {
    id,
    contents: ''
  }

  window.state.nextNoteId++
  renderApp()
}

const NoteApp = ({notes}) => (
  <div>
    <ul className="note-list">
      {
        Object.keys(notes).map(id => (
          <li className="note-list-item" key={id}>{id}</li>
        ))
      }
    </ul>
    <button className="editor-button" onClick={onAddNote}>New Note</button>
  </div>
)

const CREATE_NOTE = 'CREATE_NOTE'
const UPDATE_NOTE = 'UPDATE_NOTE'

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case CREATE_NOTE: {
      const id = state.nextNoteId
      const newnote = {
        id,
        content: ''
      }
      return {
        ...state,
        nextNoteId: id + 1,
        notes: {
          ...state.notes,
          [id]: newnote
        }
      }
    }
    case UPDATE_NOTE: {
      const {id, content} = action
      const editedNote = {
        ...state.notes[id],
        content
      }
      return {
        ...state,
        notes: {
          ...state.notes,
          [id]: editedNote
        }
      }
    }
    default:
      return state
  }
}

const renderApp = () => {
  ReactDOM.render(
    <NoteApp notes={window.state.notes}/>,
    document.getElementById('root')
  )
}

renderApp()
