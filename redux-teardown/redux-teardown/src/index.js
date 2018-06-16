import React from 'react';
import ReactDOM from 'react-dom';


const CREATE_NOTE = 'CREATE_NOTE'
const UPDATE_NOTE = 'UPDATE_NOTE'
const OPEN_NOTE   = 'OPEN_NOTE'
const CLOSE_NOTE  = 'CLOSE_NOTE'

const initialState = {
  nextNoteId: 1,
  notes: {},
  openNoteId: null
}

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

const validateAction = action => {
  if(!action || typeof action !== 'object' || Array.isArray(action)) {
    throw new Error('Action must be an object')
  }
  if(typeof action.type === 'undefined') {
    throw new Error('Action must have type')
  }
}

const createStore = (reducer) => {
  let state;
  const subscribers = []

  const store = {
    //dispatches an action to subscribers array
    dispatch: (action) => {
      validateAction(action)
      state = reducer(state, action)
      subscribers.forEach(handler => handler())
    },
    //returns state
    getState: () => state,
    //pushes dom element to subscribers array
    subscribe: handler => {
      subscribers.push(handler)
      return () => {
        const index = subscribers.indexOf(handler)

        if(index > 0) {
          subscribers.splice(index, 1)
        }
      }
    }
  }
  store.dispatch({type: '@@redux/INIT'})
  return store
}

const store = createStore(reducer)

store.subscribe(() => {
  ReactDOM.render(
    <pre>{JSON.stringify(store.getState(), null, 2)}</pre>,
    document.getElementById('root')
  )
})

store.dispatch({
  type: CREATE_NOTE
});

store.dispatch({
  type: UPDATE_NOTE,
  id: 1,
  content: 'Hello, world!'
});

// const renderApp = () => {
//   ReactDOM.render(
//     <NoteApp notes={window.state.notes}/>,
//     document.getElementById('root')
//   )
// }
// renderApp()

/*** Components ***/
const NoteEditor = ({note, onChangeNote, onCloseNote}) => (
  <div>
    <div>
      <textarea
        className="editor-content"
        autoFocus
        value={note.content}
        onChange={event => onChangeNote(note.id, event.target.value)}
        rows={10} cols={80}
      />
    </div>
    <button className="editor-content" onClick={onCloseNote}>Close</button>
  </div>
)

const NoteTitle = ({note}) => {
  const title = note.content.split('\n').replace(/^\s+|\s+$/g, '')

  if(title === '') {
    return <i>Untitled</i>
  }

  return <span>{title}</span>
}

const NoteLink = ({note, onOpenNote}) => {
  <li className="note-list-item">
    <a href="#" onClick={() => onOpenNote(note.id)}>
      <NoteTitle note={note}/>
    </a>
  </li>
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
    {/* <button className="editor-button" onClick={onAddNote}>New Note</button> */}
  </div>
)
