'use client';
import React, { createContext, useReducer, useContext } from "react";
import { Modal, Button } from "semantic-ui-react";

interface ModalState {
  showModal: boolean;
  modalContent: React.ReactNode;
}

const initialState: ModalState = {
  showModal: false,
  modalContent: <></>,
};

type Action = 
  | { type: 'OPEN_MODAL', content: React.ReactNode }
  | { type: 'CLOSE_MODAL' };

function modalReducer(state: ModalState, action: Action): ModalState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { showModal: true, modalContent: action.content };
    case 'CLOSE_MODAL':
      return { ...state, showModal: false };
    default:
      return state;
  }
}

const ModalContext = createContext<{
  state: ModalState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {children}
      <Modal open={state.showModal}>
        <Modal.Content>{state.modalContent}</Modal.Content>
        <Modal.Actions>
          <Button onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>Close</Button>
        </Modal.Actions>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  const showModal = (content: React.ReactNode) => {
    context.dispatch({ type: 'OPEN_MODAL', content });
  };

  const hideModal = () => {
    context.dispatch({ type: 'CLOSE_MODAL' });
  };

  return { showModal, hideModal };
};