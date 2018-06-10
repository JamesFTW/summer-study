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

const actions = [
  {type: CREATE_NOTE},
  {type: UPDATE_NOTE, id: 1, content: 'sup'}
]

const state = actions.reduce(reducer, undefined)

const validateAction = action => {
  if(!action || typeof action !== 'object' || Array.isArray(action)) {
    throw new Error('Action must be an object')
  }
  if(typeof action.type === 'undefined') {
    throw new Error('Action must have type')
  }
}

const createStore = (reducer) => {
  let state = undefined

  return {
    dispatch: (action) => {
      validateAction(action)
      state = reducer(state, action)
    },
    getState: () => state
  }
}

const store = createStore(reducer)

store.dispatch({
  type: CREATE_NOTE
})
store.getState()

const renderApp = () => {
  ReactDOM.render(
    <NoteApp notes={window.state.notes}/>,
    document.getElementById('root')
  )
}
renderApp()
