import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  
  50% {
    border-radius: 100%;
  }
  
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div.attrs({ className: 'bg-primary' })`
  width: 30px;
  height: 30px;

  animation: ${rotate} 1s linear infinite;
`;

export default Spinner;
