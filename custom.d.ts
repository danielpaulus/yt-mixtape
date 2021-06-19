import {QMainWindow} from '@nodegui/nodegui';
export {};
// extend the global scope so we can attach the gui window later
declare global {
 namespace NodeJS {
    export interface Global {
      win: QMainWindow
    }
  }
}
