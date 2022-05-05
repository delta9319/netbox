import { getElements } from '../util';
import { StateManager } from 'src/state';
import { previousPkCheckState } from '../stores';

type PreviousPkCheckState = { element: Nullable<HTMLInputElement> };

function preventTextHighlight(): void {
  return
}

function updatePreviousPkCheckState(eventTargetElement: HTMLInputElement, state: StateManager<PreviousPkCheckState>): void {
  state.set('element', eventTargetElement);
}

function handlePkCheck(event: _MouseEvent, state: StateManager<PreviousPkCheckState>): void {
  const eventTargetElement = event.target as HTMLInputElement;
  const previousStateElement = state.get('element');
  updatePreviousPkCheckState(eventTargetElement, state);
  //Stop if user is not holding shift key
  if(event.shiftKey === false){
    return
  }
  //If no previous state, store event target element as previous state and return
  if (previousStateElement === null) {
    return updatePreviousPkCheckState(eventTargetElement, state);
  }
  const checkboxList = getElements<HTMLInputElement>('input[type="checkbox"][name="pk"]');
  let changePkCheckboxState = false;
  for(const element of checkboxList){
    //The previously clicked checkbox was above the shift clicked checkbox 
    if(element === previousStateElement){
      if(changePkCheckboxState === true){
        changePkCheckboxState = false;
        return 
      }
      changePkCheckboxState = true;
    }
    //Change loop's current checkbox state to eventTargetElement checkbox state
    if(changePkCheckboxState === true){
      element.checked = eventTargetElement.checked;
    }
    //The previously clicked checkbox was below the shift clicked checkbox 
    if(element === eventTargetElement){
      if(changePkCheckboxState === true){
        changePkCheckboxState = false
        return
      }
      changePkCheckboxState = true;
    }
  }
}

export function initSelectMultiple(): void {
  const checkboxElements = getElements<HTMLInputElement>('input[type="checkbox"][name="pk"]');
  for (const element of checkboxElements) {
    element.addEventListener('click', (event) => {
      //Prevents shift+click from selecting table text
      document.addEventListener('selectstart', preventTextHighlight)
      //Stop propogation to avoid event firing multiple times
      event.stopPropagation();
      //Main logic for multi select
      handlePkCheck(event, previousPkCheckState);
      //Re-enables user's ability to select table text
      document.removeEventListener('selectstart', preventTextHighlight)
    });
  }
}
