export interface Component {
  cleanup?: () => void;
}

export interface CardComponent extends Component, HTMLDivElement {}
export interface CountdownComponent extends Component, HTMLDivElement {}
